"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import PromotionsTable from "./PromotionsTable";

const Promotions = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Users" /> */}
      <div className="py-2">
        <PromotionsTable />
      </div>
    </Container>
  );
};

export default Promotions;
