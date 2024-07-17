import { Fragment, useEffect } from "react";

// 3rd party packages
import Joi from "joi";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

// custom packages
import {
  AppointmentAPI,
  CustomerAPI,
  ServiceAPI,
  UserAPI,
} from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios";

// validation schema
const schema = Joi.object({
  customer: Joi.string().required().label("Customer"),
  service: Joi.string().required().label("Service"),
  dateTime: Joi.date().label("Date"),
  amount: Joi.number().required().label("Amount"),
  tn: Joi.string().min(5).max(10).required().label("TN"),
  status: Joi.string().min(2).max(20).required().label("Status"),
});

// Helper function to generate a random TN number
const generateRandomTN = () => {
  const length = Math.floor(Math.random() * 6) + 5; // Generate length between 5 and 10
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let tn = "";
  for (let i = 0; i < length; i++) {
    tn += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return tn;
};

// component
const AppointmentsModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const { data: customers } = useQuery({
    queryKey: [CustomerAPI],
    queryFn: () =>
      request({
        url: CustomerAPI,
        method: "GET",
      }),
    select: (res) => res.data?.data?.docs,
  });

  const { data: services } = useQuery({
    queryKey: [ServiceAPI],
    queryFn: () =>
      request({
        url: ServiceAPI,
        method: "GET",
        params: {
          options: {
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
        },
      }),
    select: (res) => res.data?.data?.docs,
  });

  const defaultValues = {
    customer: selectedRow?.customer || customers?.[0]?._id || "",
    service: selectedRow?.service || services?.[0]?._id || "",
    dateTime: selectedRow?.dateTime || "",
    tn: selectedRow?.tn || generateRandomTN(),
    amount: selectedRow?.amount || services?.[0]?.price || "",
    status: selectedRow?.status || "pending",
  };

  const {
    control,
    setError,
    handleSubmit,
    register,
    clearErrors,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues, resolver: joiResolver(schema) });

  const { mutate, isPending: isLoading } = useCreate(
    AppointmentAPI,
    "Appointment Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    AppointmentAPI,
    "Appointment Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
    }
  );

  const onSubmit = (data) => {
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      mutate(data);
    }
  };

  const onDiscard = () => {
    clearErrors();
    reset();
    setShowModal(false);
    setSelectedRow && setSelectedRow();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (selectedRow) {
      reset({
        ...defaultValues,
        customer: selectedRow?.customer || customers?.[0]?._id || "",
        service: selectedRow?.service || services?.[0]?._id || "",
        dateTime: selectedRow?.dateTime || "",
        tn: selectedRow?.tn || generateRandomTN(),
        amount: selectedRow?.amount || services?.[0]?.price || "",
        status: selectedRow?.status || "pending",
      });
    }
  }, [selectedRow, customers, services]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClosed={onDiscard}
        toggle={toggleModal}
        modalClassName=""
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Appointment" : "Update Appointments"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="customer">
                  Customer
                </Label>
                <Controller
                  name="customer"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="customer"
                      type="select"
                      placeholder="customer"
                      {...register(
                        "customer",
                        { required: true },
                        "customer is required"
                      )}
                      invalid={errors.customer && true}
                      {...field}
                    >
                      <option value="">-- select option --</option>
                      {customers?.map((customer) => (
                        <option key={customer?._id} value={customer?._id}>
                          {customer.name}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.customer && (
                  <FormFeedback>{errors.customer.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="service">
                  Service
                </Label>
                <Controller
                  name="service"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="service"
                      type="select"
                      placeholder="service"
                      {...register(
                        "service",
                        { required: true },
                        "service is required"
                      )}
                      invalid={errors.service && true}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        const selectedService = services.find(
                          (service) => service._id === e.target.value
                        );
                        setValue("amount", selectedService?.price || "");
                      }}
                    >
                      <option value="">-- select option --</option>
                      {services?.map((service) => (
                        <option key={service?._id} value={service?._id}>
                          {service?.serviceType?.name +
                            "-" +
                            service?.carType?.type}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.service && (
                  <FormFeedback>{errors.service.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="amount">
                  Amount
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="amount"
                      type="string"
                      placeholder="amount"
                      {...register(
                        "amount",
                        { required: true },
                        "amount is required"
                      )}
                      invalid={errors.amount && true}
                      {...field}
                    />
                  )}
                />
                {errors.amount && (
                  <FormFeedback>{errors.amount.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="dateTime">
                  DateTime
                </Label>
                <Controller
                  name="dateTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="dateTime"
                      type="datetime-local"
                      placeholder="dateTime"
                      {...register(
                        "dateTime",
                        { required: true },
                        "dateTime is required"
                      )}
                      invalid={errors.dateTime && true}
                      {...field}
                    />
                  )}
                />
                {errors.dateTime && (
                  <FormFeedback>{errors.dateTime.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="tn">
                  TN
                </Label>
                <Controller
                  name="tn"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="tn"
                      type="string"
                      placeholder="tn"
                      {...register("tn", { required: true }, "tn is required")}
                      invalid={errors.tn && true}
                      {...field}
                      readOnly
                    />
                  )}
                />
                {errors.tn && <FormFeedback>{errors.tn.message}</FormFeedback>}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="status">
                  Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="status"
                      type="select"
                      placeholder="status"
                      {...register(
                        "status",
                        { required: true },
                        "Status is required"
                      )}
                      invalid={errors.status && true}
                      {...field}
                    >
                      <option value="">-- select option --</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="canceled">Canceled</option>
                    </Input>
                  )}
                />
                {errors.status && (
                  <FormFeedback>{errors.status.message}</FormFeedback>
                )}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Col className="d-flex justify-content-end">
              <Button
                type="submit"
                className="me-1"
                color="primary"
                disabled={isLoading || updateLoading}
              >
                {(isLoading || updateLoading) && (
                  <Spinner size="sm" className="me-2" />
                )}
                {isLoading || updateLoading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="reset"
                className="w-20"
                color="dark"
                outline
                onClick={onDiscard}
              >
                Close
              </Button>
            </Col>
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default AppointmentsModal;
