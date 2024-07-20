import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { ServiceAPI } from "common/utils/axios/api";
import ServicesModal from "./ServicesModal";
import useDelete from "hooks/useDelete";

//

const ServicesTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(ServiceAPI, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Service ${name}?`,
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
    // {
    //   name: "serviceTypeId",
    //   sortable: true,
    //   width: "20%",
    //   sortField: "serviceTypeId",
    //   selector: (row) => row?.serviceTypeId ?? "",
    //   cell: (row) => <div className="">{row?.serviceTypeId ?? ""}</div>,
    //   cell: (row) => (
    //     <div className="d-flex align-items-center">
    //       <div className="ms-0">
    //         <div className="fw-bold">{row?.serviceTypeId ?? ""}</div>
    //         <div className="font-small-2 text-muted">{row?.email || ""}</div>
    //       </div>
    //     </div>
    //   ),
    // },

    {
      name: "Service Type",
      sortable: true,
      sortField: "serviceType",
      selector: (row) => row?.serviceType.name ?? "",
      cell: (row) => <div className="">{row?.serviceType?.name ?? "-"}</div>,
    },
    {
      name: "Car Type",
      sortable: true,
      sortField: "carType",
      selector: (row) => row?.carType.type ?? "",
      cell: (row) => <div className="">{row?.carType?.type ?? "-"}</div>,
    },

    {
      name: "price",
      sortable: true,
      sortField: " price",
      selector: (row) => row?.price ?? "-",
      cell: (row) => <div className="">{row?.price ?? "-"}</div>,
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
    {
      name: "Reg. Date",
      sortable: true,
      sortField: "createdAt",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span className="text-capitalize">
          {moment(row.createdAt).format("DD-MMM-YYYY")}
        </span>
      ),
    },

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
      <ServicesModal
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
            path: "serviceType",
            dir: "servicetypes",
            select: "name",
          },
          {
            path: "carType",
            dir: "cartypes",
            select: "type",
          },
        ]}
        query={{}}
        title="Service"
        url={ServiceAPI}
        searchFields={["name"]}
      />
    </>
  );
};

export default ServicesTable;
