import React, { useState } from "react";
import { useRouter } from "next/navigation";

//3rd party libraries
import { Edit2, Trash2 } from "react-feather";
import { Badge } from "reactstrap";
import moment from "moment";
import Swal from "sweetalert2";

//custom packages
import Table from "common/Table";
import { UserAPI } from "common/utils/axios/api";
import PromotionsModal from "./PromotionsModal";
import useDelete from "hooks/useDelete";

//

const PromotionsTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  //delete mutation
  const { mutate, isPending: isLoading } = useDelete(UserAPI, false, () => {
    //   setShowModal(false);
    //   setSelectedRow(null);
  });

  //delete function
  const handleConfirmDelete = async (id, name) => {
    return Swal.fire({
      title: `Delete Promotion ${name}?`,
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
      name: "code",
      sortable: true,
      width: "20%",
      sortField: "code",
      selector: (row) => row?.code ?? "",
      cell: (row) => <div className="">{row?.code ?? ""}</div>,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <div className="ms-0">
            <div className="fw-bold">{row?.code ?? ""}</div>
            <div className="font-small-2 text-muted">{row?.email || ""}</div>
          </div>
        </div>
      ),
    },

    {
      name: "description",
      sortable: true,
      sortField: "description",
      selector: (row) => row?.description ?? "",
      cell: (row) => <div className="">{row?.description ?? "-"}</div>,
    },

    {
      name: "percentage",
      sortable: true,
      sortField: "percentage",
      selector: (row) => row?.percentage ?? "",
      cell: (row) => <div className="">{row?.percentage ?? "-"}</div>,
    },

    {
      name: "validFrom",
      sortable: true,
      sortField: "validFrom",
      selector: (row) => row?.validFrom ?? "",
      cell: (row) => <div className="">{row?.validFrom ?? "-"}</div>,
    },

    {
      name: "validTo",
      sortable: true,
      sortField: "validTo",
      selector: (row) => row?.validTo ?? "",
      cell: (row) => <div className="">{row?.validTo ?? "-"}</div>,
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
      <PromotionsModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedUser}
        setSelectedRow={setSelectedUser}
      />
      <Table
        columns={columns}
        onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Promotions"
        url={UserAPI}
        searchFields={["name"]}
      />
    </>
  );
};

export default PromotionsTable;
