"use client";
// core packages
import React from "react";

// 3rd party packages
import { Container } from "react-bootstrap";

//custom packages
import { PageHeading } from "widgets";
import ReportsTable from "./ReportsTable";
import { useQuery } from "@tanstack/react-query";
import { ReportsAPI } from "common/utils/axios/api";
import request from "common/utils/axios";

const Reports = () => {
  const { data } = useQuery({
    queryKey: [ReportsAPI],
    queryFn: () =>
      request({
        url: ReportsAPI,
        method: "GET",
      }),
    select: (res) => res.data,
  });

  console.log(data);
  return (
    <Container fluid className="p-6">
      {/* <PageHeading heading="Users" /> */}
      <div className="py-2">
        <ReportsTable data={data} />
      </div>
    </Container>
  );
};

export default Reports;
