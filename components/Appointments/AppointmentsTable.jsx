import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { AppointmentAPI } from "common/utils/axios/api";
import AppointmentsModal from "./AppointmentsModal";
import useDelete from "hooks/useDelete";

//

const AppointmentsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(
    AppointmentAPI,
    false,
    () => {
      //   setShowModal(false);
      //   setSelectedRow(null);
    }
  );

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Appointment ${name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-primary ms-1",
      },

      buttonsStyling: false,
    }).then(async (result) => {
      if (result.value) {
        mutate(id);
      }
    });
  };

  //columns
  const columns = [
    {
      name: "customer",
      sortable: true,
      width: "20%",
      sortField: "customer",
      selector: (row) => row?.customer?.name ?? "",
      cell: (row) => <div className="">{row?.customer?.name ?? ""}</div>,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <div className="ms-0">
            <div className="fw-bold">{row?.customer?.name ?? ""}</div>
            <div className="font-small-2 text-muted">
              {row?.customer?.email || ""}
            </div>
          </div>
        </div>
      ),
    },

    {
      name: "service",
      sortable: true,
      sortField: "service",
      selector: (row) =>
        row?.service?.map(
          (item) => item?.serviceType?.name + " - " + item?.carType?.type
        ) ?? "",
      cell: (row) => (
        <div className="">
          {row?.service
            ?.map(
              (item) => item?.serviceType?.name + " - " + item?.carType?.type
            )
            ?.join(",") ?? "-"}
        </div>
      ),
    },
    {
      name: "dateTime",
      sortable: true,
      sortField: "dateTime",
      selector: (row) => row?.dateTime ?? "",
      cell: (row) => (
        <div className="">
          {moment(row.dateTime).format("DD MMMM, YYYY HH:MM:SS")}
        </div>
      ),
    },

    {
      name: " tn",
      sortable: true,
      sortField: " tn",
      selector: (row) => row?.tn ?? "",
      cell: (row) => <div className="">{row?.tn ?? "-"}</div>,
    },

    {
      name: "Payment Status",
      sortable: true,
      sortField: "paymentStatus",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          color={
            row?.paymentStatus?.toLowerCase() == "active"
              ? "success"
              : "warning"
          }
          className="text-capitalize"
        >
          <span className="">{row.paymentStatus}</span>
        </Badge>
      ),
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          color={row?.status?.toLowerCase() == "active" ? "success" : "warning"}
          className="text-capitalize"
        >
          <span className="">{row.status}</span>
        </Badge>
      ),
    },
    // {
    //   name: "Reg. Date",
    //   sortable: true,
    //   sortField: "createdAt",
    //   selector: (row) => row.createdAt,
    //   cell: (row) => (
    //     <span className="text-capitalize">
    //       {moment(row.createdAt).format("DD-MMM-YYYY")}
    //     </span>
    //   ),
    // },

    {
      name: "Actions",
      cell: (row) => (
        <div
          style={{
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          className="column-action"
        >
          <Edit2
            style={{ marginRight: 10 }}
            color="MidnightBlue"
            size={18}
            onClick={(e) => {
              // router.push("/create");
              setSelectedUser(row);
              setShowModal(true);
            }}
          />
          <Trash2
            style={{ marginLeft: 10 }}
            color="red"
            size={18}
            onClick={() => {
              handleConfirmDelete(row._id, row.name);
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <AppointmentsModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedUser}
        setSelectedRow={setSelectedUser}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[
          {
            path: "customer",
            dir: "customers",
            select: "name email",
          },
          {
            path: "service",
            dir: "services",
            select: "name",
            populate: [
              {
                path: "serviceType",
                dir: "servicetypes",
                select: "name",
              },
              {
                path: "carType",
                dir: "cartypes",
                select: "type",
              },
            ],
          },
        ]}
        query={{}}
        title="Appointment"
        url={AppointmentAPI}
        searchFields={["name"]}
      />
    </>
  );
};

export default AppointmentsTable;
