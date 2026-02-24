
import { useEffect, useMemo, useState } from "react";

const categories = ["Milk Chocolate", "Dark Chocolate", "Chocolate Bars", "Candy"];
const statuses = ["In Stock", "Low Stock", "Out of Stock"];

export default function InventoryForm({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    category: "Milk Chocolate",
    qty: "",
    price: "",
    status: "In Stock",
  });

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        category: "Milk Chocolate",
        qty: "",
        price: "",
        status: "In Stock",
      });
      setTouched(false);
    }
  }, [open]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.category) e.category = "Category is required.";

    const qtyNum = Number(form.qty);
    if (form.qty === "") e.qty = "Qty is required.";
    else if (!Number.isFinite(qtyNum) || qtyNum < 0) e.qty = "Qty must be 0 or more.";

    const priceNum = Number(form.price);
    if (form.price === "") e.price = "Price is required.";
    else if (!Number.isFinite(priceNum) || priceNum < 0) e.price = "Price must be 0 or more.";

    if (!form.status) e.status = "Status is required.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    onSave?.({
      name: form.name.trim(),
      category: form.category,
      qty: Number(form.qty),
      price: Number(form.price),
      status: form.status,
    });

    onClose?.();
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">Add Item</div>
          <button className="icon-btn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="modal-body">
          <div className="mfield">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Dark Chocolate"
            />
            {touched && errors.name && <div className="merror">{errors.name}</div>}
          </div>

          <div className="mgrid">
            <div className="mfield">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {touched && errors.category && <div className="merror">{errors.category}</div>}
            </div>

            <div className="mfield">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {touched && errors.status && <div className="merror">{errors.status}</div>}
            </div>
          </div>

          <div className="mgrid">
            <div className="mfield">
              <label>Qty</label>
              <input
                name="qty"
                value={form.qty}
                onChange={handleChange}
                placeholder="e.g., 12"
                inputMode="numeric"
              />
              {touched && errors.qty && <div className="merror">{errors.qty}</div>}
            </div>

            <div className="mfield">
              <label>Price</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g., 3.50"
                inputMode="decimal"
              />
              {touched && errors.price && <div className="merror">{errors.price}</div>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={!isValid}>
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}