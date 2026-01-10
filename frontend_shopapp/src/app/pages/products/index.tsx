import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ImageIcon from "@mui/icons-material/Image";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/headers/Header";
import { Product } from "@/stores/products";
import { useAppDispatch } from "@/stores";
import { addToCart } from "@/stores/cart";

export default function ProductPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openToast, setOpenToast] = useState(false);

  const product = location.state as Product | null;

  const ORANGE_BG = "#ff7a00";
  const RED_BORDER = "#d81b60";
  const RED_HOVER = "#ad1457";

  if (!product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Product not found</Typography>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </Box>
    );
  }

  const buildImageUrl = (img?: string | null) => {
    if (!img) return `/uploads/notfound.jpeg`;
    return img.startsWith("http")
      ? img
      : `/uploads/${img}`;
  };

  const getMainImage = () => {
    if (product.thumbnail) return product.thumbnail;
    if (product.images?.length) {
      const first = product.images[0];
      if (typeof first === "string") return first;
      if (first.image_url) return first.image_url;
    }
    return null;
  };

  const handleAddToCart = () => {

    const productWithId = { ...product };

    if (!productWithId.id) {
      productWithId.name = product.name;
    }

    dispatch(addToCart(productWithId));
    setOpenToast(true);
  };

  const mainImage = getMainImage();

  return (
    <Box sx={{ backgroundColor: ORANGE_BG, minHeight: "100vh" }}>
      <Header />

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, mt: 2 }}>
        <Breadcrumbs sx={{ color: "#fff", mb: 2 }}>
          <Link
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer", color: "#fff" }}
          >
            Home
          </Link>
          <Typography fontWeight={800} color="#fff">
            {product.name}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* MAIN */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: "#fff",
            border: `3px solid ${RED_BORDER}`,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* IMAGE */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                border: `3px solid ${RED_BORDER}`,
                backgroundColor: "#fff",
              }}
            >
              <img
                src={buildImageUrl(mainImage)}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 420,
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.currentTarget.src = `/uploads/notfound.jpeg`;
                }}
              />
            </Paper>

            {/* INFO */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: `3px solid ${RED_BORDER}`,
              }}
            >
              <Typography variant="h5" fontWeight={900}>
                <Inventory2Icon
                  sx={{ color: RED_BORDER, mr: 1, verticalAlign: "middle" }}
                />
                {product.name}
              </Typography>

              <Divider sx={{ my: 2, borderColor: RED_BORDER }} />

              {/* PRICE BOX */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `3px solid ${RED_BORDER}`,
                  mb: 2,
                }}
              >
                <Typography variant="body2" fontWeight={700}>
                  PRICE
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{ color: RED_BORDER }}
                >
                  ${product.price}
                </Typography>
              </Box>

              <Typography sx={{ mb: 2 }}>
                {product.description || "No description available."}
              </Typography>

              {/* ADD TO CART BUTTON */}
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  backgroundColor: RED_BORDER,
                  color: "#fff",
                  fontWeight: 900,
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: RED_HOVER,
                  },
                }}
              >
                Add to Cart
              </Button>

              <Button
                startIcon={<ArrowBackIcon />}
                variant="text"
                onClick={() => navigate(-1)}
                sx={{
                  ml: 1.5,
                  fontWeight: 800,
                  color: RED_BORDER,
                }}
              >
                Back
              </Button>

              {/* POLICY BOX */}
              <Box sx={{ position: "relative", mt: 3 }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 2,
                    backgroundColor: RED_BORDER,
                    zIndex: 0,
                  }}
                />

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: `3px solid ${RED_BORDER}`,
                    backgroundColor: "#fff",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Typography
                    fontWeight={900}
                    mb={1}
                    sx={{ color: RED_BORDER }}
                  >
                    Ưu đãi & Chính sách
                  </Typography>

                  <Typography
                    sx={{
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ShieldOutlinedIcon
                      sx={{ color: RED_BORDER, fontSize: 20 }}
                    />
                    Trả hàng <strong>miễn phí trong vòng 15 ngày</strong>
                  </Typography>

                  <Typography sx={{ mb: 0.5 }}>
                    🚚 Nhận hàng từ <strong>1 – 3 ngày</strong> kể từ ngày đặt
                    hàng
                  </Typography>

                  <Typography>
                    🎁 <strong>Tặng voucher giảm 20%</strong> (tối đa{" "}
                    <strong>100.000 VND</strong>) nếu đơn hàng đến muộn hơn dự
                    kiến
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Paper>

        {/* MORE IMAGES */}
        {product.images && product.images.length > 1 && (
          <Paper
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: "#fff",
              borderRadius: 4,
              border: `3px solid ${RED_BORDER}`,
            }}
          >
            <Typography variant="h6" fontWeight={900} mb={2}>
              <ImageIcon
                sx={{ color: RED_BORDER, mr: 1, verticalAlign: "middle" }}
              />
              MORE IMAGES
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2,1fr)",
                  md: "repeat(4,1fr)",
                },
                gap: 2,
              }}
            >
              {product.images.slice(0, 8).map((image, index) => {
                const imgSrc =
                  typeof image === "string"
                    ? buildImageUrl(image)
                    : buildImageUrl(image.image_url);

                return (
                  <Box
                    key={index}
                    sx={{
                      height: 140,
                      borderRadius: 2,
                      border: `3px solid ${RED_BORDER}`,
                      overflow: "hidden",
                      transition: "0.2s",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name}-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = `/uploads/notfound.jpeg`;
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}
      </Box>

      {/* TOAST NOTIFICATION */}
      <Snackbar
        open={openToast}
        autoHideDuration={2000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled">
          "{product.name}" đã được thêm vào giỏ hàng!
        </Alert>
      </Snackbar>
    </Box>
  );
}
