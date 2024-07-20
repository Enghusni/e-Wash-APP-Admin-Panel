import { Fragment, useEffect } from "react";

//3rd party packages
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

//custom packages
import { CarTypeAPI, ServiceAPI, ServiceTypeAPI } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios";

//validation schema
const schema = Joi.object({
  serviceType: Joi.string().min(2).max(100).required().label("Service Type"),
  carType: Joi.string().min(2).max(100).required().label("Car Type"),
  price: Joi.number().required().label("price"),
  status: Joi.string().min(2).max(20).required().label("status"),
});

//component
const ServicesModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  console.log(ServiceAPI);

  const defaultValues = {
    serviceType: selectedRow?.serviceType || "",
    carType: selectedRow?.carType || "",
    price: selectedRow?.price || "",
    status: selectedRow?.status || "active",
  };

  const {
    control,
    setError,
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({ defaultValues, resolver: joiResolver(schema) });

  const { data: servicesTypes } = useQuery({
    queryKey: [ServiceTypeAPI],
    queryFn: () =>
      request({
        url: ServiceTypeAPI,
        method: "GET",
      }),

    select: (res) => res.data?.data?.docs,
  });

  const { data: carTypes } = useQuery({
    queryKey: [CarTypeAPI],
    queryFn: () =>
      request({
        url: CarTypeAPI,
        method: "GET",
      }),

    select: (res) => res.data?.data?.docs,
  });

  const { mutate, isPending: isLoading } = useCreate(
    ServiceAPI,
    "Service Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ServiceAPI,
    "Service Updated Successfully",
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
        serviceType: selectedRow?.serviceType || "",
        carType: selectedRow?.carType || "",
        price: selectedRow?.price || "",
        status: selectedRow?.status || "active",
      });
    }
  }, [selectedRow]);

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
            {!selectedRow ? "New Service" : "Update Service"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="serviceType">
                  Service Type
                </Label>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="serviceType"
                      type="select"
                      placeholder="serviceType"
                      {...register(
                        "serviceType",
                        { required: true },
                        "serviceType is required"
                      )}
                      invalid={errors.serviceType && true}
                      {...field}
                    >
                      {servicesTypes?.map((type) => (
                        <option key={type?._id} value={type?._id}>
                          {type.name}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.serviceType && (
                  <FormFeedback>{errors.serviceType.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="carType">
                  Car Type
                </Label>
                <Controller
                  name="carType"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="carType"
                      type="select"
                      placeholder="carType"
                      {...register(
                        "carType",
                        { required: true },
                        "carType is required"
                      )}
                      invalid={errors.carType && true}
                      {...field}
                    >
                      {carTypes?.map((type) => (
                        <option key={type?._id} value={type?._id}>
                          {type.type}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.carType && (
                  <FormFeedback>{errors.carType.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="price">
                  price
                </Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="price"
                      placeholder="price"
                      {...register(
                        "price",
                        { required: true },
                        "price is required"
                      )}
                      invalid={errors.price && true}
                      {...field}
                    />
                  )}
                />
                {errors.price && (
                  <FormFeedback>{errors.price.message}</FormFeedback>
                )}
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
                      <option value="active">Active</option>
                      <option value="inactive">InActive</option>
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

export default ServicesModal;
