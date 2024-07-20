// Import necessary modules
import Link from "next/link";
import { ProgressBar, Col, Row, Card, Table, Image } from "react-bootstrap";
import moment from "moment";
import { Badge } from "reactstrap";

// Import required data
import ActiveProjectsData from "data/dashboard/ActiveProjectsData";

const ReportsTable = ({ data }) => {
  return (
    <Row className="mt-6">
      <Col md={12} xs={12}>
        <Card>
          <Card.Header className="bg-white py-4">
            <h4 className="mb-0">Booking Reports</h4>
          </Card.Header>
          <Table responsive className="text-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer Name</th>
                <th>Service</th>
                <th>Date Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">
                    <div className="d-flex align-items-center">
                      <div className="ms-3 lh-1">
                        <h5 className="mb-1">
                          <Link href="#" className="text-inherit">
                            {item.customer?.name}
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle">
                    <div>
                      {item.service
                        ?.map(
                          (service) =>
                            `${service?.serviceType?.name} - ${service?.carType?.type}`
                        )
                        .join(", ") ?? "-"}
                    </div>
                  </td>
                  <td className="align-middle">
                    {moment(item.dateTime).format("DD MMMM, YYYY HH:MM:SS")}
                  </td>
                  <td className="align-middle text-dark">
                    <Badge
                      color={
                        item?.status?.toLowerCase() == "approved"
                          ? "success"
                          : item?.status?.toLowerCase() == "rejected"
                          ? "danger"
                          : "warning"
                      }
                      className="text-capitalize"
                    >
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Col>
    </Row>
  );
};

export default ReportsTable;
