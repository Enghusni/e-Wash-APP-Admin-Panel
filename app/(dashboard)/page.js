"use client";
// import node module libraries
import { Fragment } from "react";
import Link from "next/link";
import { Container, Col, Row } from "react-bootstrap";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios";
import { DashboardAPI } from "common/utils/axios/api";

const Home = () => {
  const { data } = useQuery({
    queryKey: [DashboardAPI],
    queryFn: () =>
      request({
        url: DashboardAPI,
        method: "GET",
      }),

    select: (res) => res.data,
  });

  console.log(data?.summary);

  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          {data?.summary.map((item, index) => {
            return (
              <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                <StatRightTopIcon info={item} />
              </Col>
            );
          })}
        </Row>

        {/* Active Projects  */}
        <ActiveProjects data={data?.latestBookings} />

        <Row className="my-6">
          <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            {/* Tasks Performance  */}
            {/* <TasksPerformance /> */}
          </Col>
          {/* card  */}
          <Col xl={8} lg={12} md={12} xs={12}>
            {/* Teams  */}
            {/* <Teams /> */}
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default Home;
