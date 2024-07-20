import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2, CheckCircle, RefreshCw } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { CustomerCareAPI } from "common/utils/axios/api";
import UsersModal from "./UsersModal";
import useDelete from "hooks/useDelete";
import useUpdate from "hooks/useUpdate";

//

const UsersTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(
    CustomerCareAPI,
    false,
    () => {
      //   setShowModal(false);
      //   setSelectedRow(null);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    CustomerCareAPI,
    "Updated Successfully",
    () => {}
  );

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete User ${name}?`,
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
      name: "Customer",
      sortable: true,
      width: "20%",
      sortField: "name",
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
      name: "Subject",
      sortable: true,
      sortField: "subject",
      selector: (row) => row?.subject ?? "",
      cell: (row) => <div className="">{row?.subject ?? "-"}</div>,
    },

    {
      name: "Message",
      sortable: true,
      sortField: "message",
      selector: (row) => row?.message ?? "-",
      cell: (row) => <div className="">{row?.message ?? "-"}</div>,
    },
    {
      name: "Tell",
      sortable: true,
      sortField: "tel",
      selector: (row) => row?.tel ?? "-",
      cell: (row) => <div className="">{row?.tel ?? "-"}</div>,
    },

    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => (
        <Badge
          color={
            row?.status?.toLowerCase() === "open"
              ? "danger"
              : row?.status?.toLowerCase() === "in-progress"
              ? "warning"
              : "success"
          }
          className="text-capitalize"
        >
          <span className="">{row.status}</span>
        </Badge>
      ),
    },
    {
      name: "Priority",
      sortable: true,
      sortField: "priority",
      selector: (row) => row.priority,
      cell: (row) => (
        <Badge
          color={
            row?.priority?.toLowerCase() === "low"
              ? "success"
              : row?.priority?.toLowerCase() === "medium"
              ? "warning"
              : row?.priority?.toLowerCase() === "high"
              ? "danger"
              : "secondary" // Default color if no match is found
          }
          className="text-capitalize"
        >
          <span className="">{row.priority}</span>
        </Badge>
      ),
    },
    {
      name: "Date",
      sortable: true,
      sortField: "createdAt",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span className="text-capitalize">
          {moment(row.createdAt).format("DD-MMM-YYYY HH:MM:SS")}
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
          <RefreshCw
            style={{ marginRight: 10 }}
            color="MidnightBlue"
            size={18}
            onClick={(e) => {
              // router.push("/create");
              mutateUpdate({
                data: { status: "in-progress" },
                updateId: row?._id,
              });
            }}
          />
          <CheckCircle
            style={{ marginRight: 10 }}
            color="MidnightBlue"
            title="Resolve"
            size={18}
            onClick={(e) => {
              // router.push("/create");
              mutateUpdate({
                data: { status: "resolved" },
                updateId: row?._id,
              });
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <UsersModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedUser}
        setSelectedRow={setSelectedUser}
      />
      <Table
        columns={columns}
        // onCreateAction={() => setShowModal(true)}
        populate={[
          {
            path: "customer",
            dir: "customers",
            select: "name email",
          },
        ]}
        query={{}}
        title="Supports"
        url={CustomerCareAPI}
        searchFields={["name"]}
      />
    </>
  );
};

export default UsersTable;
