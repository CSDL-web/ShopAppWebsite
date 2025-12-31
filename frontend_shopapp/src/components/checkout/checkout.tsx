import { COLORS } from "@/styles/colors";
import { Box, Container, Typography } from "@mui/material";
import React from "react";

import { useAppSelector } from "@/stores";
import { getCart } from "@/stores/cart";
import { Product } from "../products/fakeData";
import CheckoutHeader from "./checkout_header";
import CheckoutSection from "./checkout_section";
import CheckoutItem from "./checkout_item";
import CustomBox from "../customBox";
import CustomButton from "../customButton";
import ProductLinkText from "../productLinkText";
import OrderSummary from "../OrderSummary";

const Checkout = () => {
  const cart = useAppSelector(getCart);

  const subtotal = cart.reduce(
    (sum: number, item: Product) => sum + (item.price ?? 0),
    0
  );

  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  return (
    <Box>
      <CheckoutHeader items={cart.length} />

      <Container sx={{ display: "flex", marginTop: "0.5rem", gap: "2rem" }}>
        {/* LEFT */}
        <Box sx={{ width: "45vw" }}>
          <CheckoutSection number={1} title="Shipping Address">
            <Typography>
              Harry Potter <br />
              123 Diagon Alley <br />
              London WC2H 9FB <br />
              United Kingdom
            </Typography>
          </CheckoutSection>

          <CheckoutSection number={2} title="Payment Method">
            <Typography fontWeight={700}>
              Paying with Galleons
            </Typography>
            <Typography>
              <span style={{ color: COLORS.teal }}>Billing address:</span>{" "}
              Harry Potter, 123 Diagon Alley...
            </Typography>
          </CheckoutSection>

          <CheckoutSection
            number={3}
            title="Review Items and shipping"
            sx={{ flexDirection: "column" }}
          >
            {cart.map((item: Product) => (
              <CheckoutItem key={item.id} item={item} />
            ))}

            <CustomBox sx={{ display: "flex", marginLeft: "3.5rem" }}>
              <CustomButton
                onClick={() => console.log("Place order")}
                sx={{ width: "12rem", marginRight: "1rem" }}
              >
                Place Your Order
              </CustomButton>

              <Box>
                <Typography sx={{ color: COLORS.red, fontWeight: 700 }}>
                  Order total: ${total.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  By placing your order, you agree to Amazon&apos;s{" "}
                  <ProductLinkText>privacy notice</ProductLinkText> and{" "}
                  <ProductLinkText>conditions of use</ProductLinkText>.
                </Typography>
              </Box>
            </CustomBox>
          </CheckoutSection>
        </Box>

        {/* RIGHT */}
        <OrderSummary
          subtotal={subtotal}
          tax={tax.toFixed(2)}
          total={total.toFixed(2)}
        />
      </Container>
    </Box>
  );
};

export default Checkout;
