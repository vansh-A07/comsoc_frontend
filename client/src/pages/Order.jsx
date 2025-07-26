import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [address, setAddress] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/orders/my", {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddItem = () => {
    if (!itemName || itemQuantity <= 0) {
      setError("Please provide valid item name and quantity.");
      return;
    }
    setItems((prev) => [...prev, { name: itemName, quantity: itemQuantity }]);
    setItemName("");
    setItemQuantity("");
    setError("");
  };

  const handleRemoveItem = (indexToRemove) => {
    setItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (items.length === 0) {
      setError("Please add at least one item to your order.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        "http://localhost:5000/orders",
        { items, address },
        { withCredentials: true }
      );
      setSuccess("Order placed successfully!");
      setItems([]);
      setAddress("");
      fetchOrders();
    } catch (err) {
      console.error("Order placement failed:", err);
      setError("Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-layout">
      <div className="order-container">
        <h2 className="order-title">📦 My Orders</h2>

        <form className="order-form" onSubmit={handleSubmit}>
          <h3>Add Items</h3>

          <div className="item-inputs">
            <input
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Qty"
              min="1"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              required
            />
            <button type="button" onClick={handleAddItem}>
              + Add
            </button>
          </div>

          <div className="pending-items">
            {items.map((itm, idx) => (
              <div key={idx} className="pending-item">
                <span>
                  {itm.name} × {itm.quantity}
                </span>
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <label>Delivery Address</label>
          <input
            type="text"
            className="address-input"
            placeholder="Enter delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <button type="submit" disabled={!items.length || !address}>
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {error && <p className="order-error">{error}</p>}
        {success && <p className="order-success">{success}</p>}

        {loading ? (
          <p className="loading">Loading orders...</p>
        ) : Array.isArray(orders) && orders.length > 0 ? (
          <div className="order-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span>🆔 {order._id}</span>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p className="order-address"> {order.address}</p>

                <ul className="order-items">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} × <strong>{item.quantity}</strong>
                    </li>
                  ))}
                </ul>
                <div className="order-footer">
                  <small>
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-orders">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Order;
