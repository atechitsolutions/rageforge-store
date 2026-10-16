package com.rageforge.store.service;

import com.rageforge.store.dto.Dtos.*;
import com.rageforge.store.model.*;
import com.rageforge.store.repo.OrderRepository;
import com.rageforge.store.repo.ProductRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {
    // Demo rules, mirrored in the React app (frontend/src/api.js).
    static final Map<String, Integer> COUPONS = Map.of("RAGE10", 10);
    static final int FREE_SHIPPING_OVER = 999;
    static final int SHIPPING_FEE = 79;

    private final OrderRepository orders;
    private final ProductRepository products;

    public OrderService(OrderRepository orders, ProductRepository products) {
        this.orders = orders;
        this.products = products;
    }

    /** Prices are always re-read from the database; the client's prices are ignored. */
    @Transactional
    public OrderResponse place(OrderRequest req) {
        CustomerOrder o = new CustomerOrder();
        o.setCustomerName(req.customerName().trim());
        o.setEmail(req.email().trim());
        o.setPhone(req.phone());
        o.setAddress(req.address().trim());
        o.setCity(req.city().trim());
        o.setPincode(req.pincode());

        int subtotal = 0;
        for (OrderItemRequest item : req.items()) {
            Product p = products.findById(item.productId())
                    .orElseThrow(() -> bad("Unknown product " + item.productId()));
            SizeOption size = p.getSizes().stream().filter(s -> s.getLabel().equals(item.size())).findFirst()
                    .orElseThrow(() -> bad("Unknown size '" + item.size() + "' for " + p.getName()));
            if (!p.getFlavours().contains(item.flavour())) throw bad("Unknown flavour '" + item.flavour() + "' for " + p.getName());
            o.getLines().add(new OrderLine(p.getId(), p.getName(), size.getLabel(), item.flavour(), size.getPrice(), item.qty()));
            subtotal += size.getPrice() * item.qty();
        }

        String code = req.coupon() == null ? "" : req.coupon().trim().toUpperCase();
        int pct = COUPONS.getOrDefault(code, 0);
        int discount = Math.round(subtotal * pct / 100f);
        int shipping = subtotal - discount >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
        o.setCoupon(pct > 0 ? code : null);
        o.setSubtotal(subtotal);
        o.setDiscount(discount);
        o.setShipping(shipping);
        o.setTotal(subtotal - discount + shipping);

        CustomerOrder saved = orders.save(o);
        List<OrderLineDto> lines = new ArrayList<>();
        for (OrderLine l : saved.getLines())
            lines.add(new OrderLineDto(l.getProductId(), l.getProductName(), l.getSizeLabel(), l.getFlavour(), l.getUnitPrice(), l.getQty()));
        return new OrderResponse("RF-" + String.format("%06d", saved.getId()), saved.getStatus(), saved.getCustomerName(),
                saved.getSubtotal(), saved.getDiscount(), saved.getShipping(), saved.getTotal(), lines);
    }

    private static ResponseStatusException bad(String msg) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg); }
}
