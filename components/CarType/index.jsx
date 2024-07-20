"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import CarTypeTable from "./CarTypeTable";

const Services = () => {
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Users" /> */}
      <div className="py-2">
        <CarTypeTable />
      </div>
    </Container>
  );
};

export default Services;
