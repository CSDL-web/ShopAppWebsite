// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Container } from "@mui/material";

// export default function SearchPage() {
//   const { query } = useParams<{ query: string }>();
//   const { filteredProducts, getFilteredProducts } = useState();

//   useEffect(() => {
//     if (!query) return;
//     getFilteredProducts(query);
//   }, [query, getFilteredProducts]);

//   return (
//     <Container sx={{ marginTop: "2rem" }}>
//       <SearchResults products={filteredProducts} />
//     </Container>
//   );
// }