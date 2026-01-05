import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useState } from "react";
import { useAppDispatch } from "@/stores";
import { registerUser } from "@/stores/authSlice";

type Props = {
  slug: string;
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "add" | "edit";
  initialData?: Record<string, any>;
};

const Add = (props: Props) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Record<string, any>>(
    props.initialData || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname?.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (props.mode === "add" && !formData.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (props.mode === "add" && formData.password?.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (props.mode === "add") {
        await dispatch(
          registerUser({
            fullname: formData.fullname,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
            address: formData.address || "",
            date_of_birth: formData.date_of_birth || "",
            role_id: formData.role_id || 1,
          })
        ).unwrap();

        alert("User created successfully!");
      }

      props.setOpen(false);
    } catch (error: any) {
      console.error("Error:", error);
      alert(error || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputType = (field: string, columnType?: string) => {
    if (columnType === "boolean") return "checkbox";

    switch (field) {
      case "email":
        return "email";
      case "phone_number":
        return "tel";
      case "date_of_birth":
        return "date";
      case "password":
        return "password";
      case "is_active":
        return "checkbox";
      default:
        return "text";
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // Filter các cột không cần hiển thị trong form
  const filteredColumns = props.columns.filter(
    (item) =>
      item.field !== "id" &&
      item.field !== "img" &&
      item.field !== "action" &&
      !item.field.includes("created") &&
      !item.field.includes("updated") &&
      item.field !== "verified"
  );

  return (
    <div className="add">
      <div className="modal">
        <span
          className="close"
          onClick={() => !isSubmitting && props.setOpen(false)}
        >
          X
        </span>
        <h1>
          {props.mode === "edit" ? "Edit" : "Add new"} {props.slug}
        </h1>
        <form onSubmit={handleSubmit}>
          {filteredColumns.map((column) => {
            const field = column.field;
            const isCheckbox =
              column.type === "boolean" || field === "is_active";
            const inputType = getInputType(field, column.type);
            const isRequired =
              field === "fullname" ||
              field === "email" ||
              field === "phone_number" ||
              (props.mode === "add" && field === "password");

            return (
              <div className="item" key={field}>
                <label htmlFor={field}>
                  {column.headerName}
                  {isRequired && " *"}
                  {errors[field] && (
                    <span className="error"> {errors[field]}</span>
                  )}
                </label>

                {isCheckbox ? (
                  <div className="checkbox-container">
                    <input
                      id={field}
                      type="checkbox"
                      checked={!!formData[field]}
                      onChange={(e) =>
                        handleInputChange(field, e.target.checked)
                      }
                      className="checkbox-input"
                      disabled={isSubmitting}
                    />
                    <label htmlFor={field} className="checkbox-label">
                      Active
                    </label>
                  </div>
                ) : inputType === "date" ? (
                  <input
                    id={field}
                    type={inputType}
                    value={formatDateForInput(formData[field] || "")}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={column.headerName?.toString()}
                    disabled={isSubmitting}
                  />
                ) : (
                  <input
                    id={field}
                    type={inputType}
                    value={formData[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={column.headerName?.toString()}
                    required={isRequired}
                    disabled={isSubmitting}
                  />
                )}
              </div>
            );
          })}

          {/* Thêm password field cho add mode */}
          {props.mode === "add" && (
            <div className="item">
              <label htmlFor="password">
                Password *
                {errors.password && (
                  <span className="error"> {errors.password}</span>
                )}
              </label>
              <input
                id="password"
                type="password"
                value={formData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Password"
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : props.mode === "edit"
              ? "Update"
              : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
