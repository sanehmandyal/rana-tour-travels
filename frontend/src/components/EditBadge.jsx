import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Renders a small "Edit" pill in the corner of a section when the logged-in
// user is an admin. This is the mechanism that connects the admin to every
// card/page on the public site: click it and go straight to the matching
// admin editor for that content section.
export default function EditBadge({ to, label = "Edit" }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return (
    <Link to={to} className="admin-edit-badge" title={`Edit ${label} in admin`}>
      <Pencil size={12} />
      {label}
    </Link>
  );
}
