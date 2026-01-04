import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/headers/Header";
import { COLORS } from "@/styles/colors";
import { Product } from "@/stores/products";

export default function ProductPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state as Product | null;

  if (!product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Product not found</Typography>
        <Button onClick={() => navigate(-1)}>Go back</Button>
      </Box>
    );
  }

  const buildImageUrl = (img?: string | null) => {
    if (!img) {
      return `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
    }
    return img.startsWith("http")
      ? img
      : `${API_URL}/backend_shopapp/uploads/${img}`;
  };

  const getMainImage = () => {
    if (product.thumbnail) return product.thumbnail;

    if (product.images?.length) {
      const first = product.images[0];
      if (typeof first === "string") return first;
      if (first.url) return first.url;
    }

    return null;
  };

  const mainImage = getMainImage();

  return (
    <Box sx={{ backgroundColor: COLORS.lightGray, minHeight: "100vh" }}>
      <Header />

      <Box
        sx={{
          maxWidth: 1200,
          margin: "2rem auto",
          display: "flex",
          gap: 4,
          backgroundColor: "#fff",
          p: 3,
        }}
      >
        {/* IMAGE */}
        <Box sx={{ flex: 1 }}>
          <img
            src={buildImageUrl(mainImage)}
            alt={product.name}
            style={{
              width: "100%",
              maxHeight: 450,
              objectFit: "contain",
            }}
            onError={(e) => {
              e.currentTarget.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
            }}
          />
        </Box>

        {/* INFO */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            {product.name}
          </Typography>

          <Typography variant="body1" sx={{ my: 2 }}>
            {product.description || "No description available."}
          </Typography>

          <Typography variant="h6" fontWeight={700} my={2}>
            ${product.price}
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: COLORS.orange,
              color: COLORS.black,
              mt: 2,
            }}
          >
            Add to Cart
          </Button>

          {product.category_id && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Category ID: {product.category_id}
            </Typography>
          )}
        </Box>
      </Box>

      {/* MORE IMAGES */}
      {product.images && product.images.length > 1 && (
        <Box
          sx={{
            maxWidth: 1200,
            margin: "2rem auto",
            backgroundColor: "#fff",
            p: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            More Images
          </Typography>

          <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
            {product.images.slice(0, 4).map((image, index) => {
              const imgSrc =
                typeof image === "string"
                  ? buildImageUrl(image)
                  : buildImageUrl(image.url);

              return (
                <Box
                  key={index}
                  sx={{
                    minWidth: 150,
                    height: 150,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`${product.name} - ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = `${API_URL}/backend_shopapp/uploads/notfound.jpeg`;
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
