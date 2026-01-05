import React from "react";
import { Box, Typography } from "@mui/material";

import { COLORS } from "@/styles/colors";
import CustomButton from "./customButton";
import CustomBox from "./customBox";
import ProductLinkText from "./productLinkText";
import CustomHR from "./CustomHR";
import OrderTotal from "./orderTotal";

type OrderSummaryProps = {
  subtotal: number;
  tax: string;
  total: string;
};

const OrderSummary = ({ subtotal, tax, total }: OrderSummaryProps) => {
  const summaryValues = [
    { title: "Subtotal (1 item)", value: `$${subtotal}` },
    { title: "Shipping & handling", value: "$0.00" },
    { title: "Total before tax", value: `$${subtotal}` },
    { title: "Estimated tax to be collected", value: `$${tax}` },
  ];

  return (
    <CustomBox sx={{ width: "15vw", marginLeft: "2rem" }}>
      <CustomButton
        sx={{ width: "100%" }}
      >
        Place Your Order
      </CustomButton>

      <Typography sx={{ textAlign: "center", mt: 1 }}>
        By placing your order, you agree to Amazon&apos;s{" "}
        <ProductLinkText>privacy notice</ProductLinkText> and{" "}
        <ProductLinkText>conditions of use</ProductLinkText>.
      </Typography>

      <CustomHR />

      <Typography variant="h6" sx={{ margin: "1rem 0" }}>
        Order Summary
      </Typography>

      {summaryValues.map((item, index) => (
        <React.Fragment key={item.title}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>{item.title}</Typography>
            <Typography>{item.value}</Typography>
          </Box>

          {index === 1 && <CustomHR />}
        </React.Fragment>
      ))}

      <CustomHR />
      <OrderTotal totalPrice={total} />
      <CustomHR />

      <Box sx={{ backgroundColor: COLORS.lightGray, padding: "1rem" }}>
        <ProductLinkText>How are shipping costs calculated?</ProductLinkText>
        <Typography sx={{ marginTop: "0.75rem" }}>
          Prime shipping benefits have been applied to your order.
        </Typography>
      </Box>
    </CustomBox>
  );
};

export default OrderSummary;
