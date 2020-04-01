import React from 'react';
import ReactDOM from 'react-dom';
import ShoppingCartItem from '../model/ShoppingCartItem.js';
import Session from '../model/Session.js';
import ProductCatalogComponent from '../ProductCatalogComponent';

export default class ShoppingCartService {
    static instance = null;
    shoppingCartItems = [];
    headerComponent;

    static getInstance() {
        if (this.instance == null) {
            this.instance = new ShoppingCartService();
        }
        return this.instance;
    }

    addProduct(product, quantity) {
        var session = Session.getInstance();
        const body = { _id: product.id, quantity: quantity, user: session.user.username }
        fetch("http://localhost:3008/api/products/SaveTemporalByUser", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            })
        const found = this.shoppingCartItems.find(sci => sci.product.id === product.id);
        if (found != null) {
            if (quantity === 0) {
                const index = this.shoppingCartItems.indexOf(found, 0);
                this.shoppingCartItems.splice(index, 1);
            } else {
                found.quantity = quantity
            }
        } else if (quantity > 0) {
            const shoppingCartItem = new ShoppingCartItem(product, quantity);
            this.shoppingCartItems.push(shoppingCartItem);
        }
        this.headerComponent.forceUpdate();
    }

    resetShoppingCart() {
        var session = Session.getInstance();
        const body = { user: session.user.username }
        fetch("http://localhost:3008/api/products/DeleteTemporalByUser", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            })
        this.shoppingCartItems = [];
        this.headerComponent.forceUpdate();
    }

    payShoppingCart() {
        var session = Session.getInstance();
        const body = { user: session.user.username }
        fetch("http://localhost:3008/api/products/BuyByUser", {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            })
        this. resetShoppingCart()
    }

    total() {
        var total = 0;
        for (let item of this.shoppingCartItems) {
            total += item.subtotal();
        }
        return total;
    }
}
