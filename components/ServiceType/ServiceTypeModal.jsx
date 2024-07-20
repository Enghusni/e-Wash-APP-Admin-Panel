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
import { ServiceTypeAPI } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(100).required().label("Name"),
  description: Joi.string().required().label("description"),
  status: Joi.string().min(2).max(20).required().label("status"),
});

//component
const ServiceTypeModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  console.log(ServiceTypeAPI);

  const defaultValues = {
    name: selectedRow?.name || "",
    description: selectedRow?.description || "",
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

  const { mutate, isPending: isLoading } = useCreate(
    ServiceTypeAPI,
    "Service Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ServiceTypeAPI,
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
        // serviceTypeId: selectedRow?.serviceTypeId || "",
        // carTypeId: selectedRow?.carTypeId || "",
        name: selectedRow?.name || "",
        description: selectedRow?.description || "",
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
              {/* <Col xs={12} className="mb-2">
                <Label className="form-label" for="serviceTypeId">
                  serviceTypeId
                </Label>
                <Controller
                  name="serviceTypeId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="serviceTypeId"
                      placeholder="serviceTypeId"
                      {...register(
                        "serviceTypeId",
                        { required: true },
                        "serviceTypeId is required"
                      )}
                      invalid={errors.serviceTypeId && true}
                      {...field}
                    />
                  )}
                />
                {errors.serviceTypeId && (
                  <FormFeedback>{errors.serviceTypeId.message}</FormFeedback>
                )}
              </Col> */}

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="name">
                  Name
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder=" name"
                      {...register(
                        "name",
                        { required: true },
                        " name is required"
                      )}
                      invalid={errors.name && true}
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="description">
                  description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="description"
                      type="textarea"
                      placeholder="description"
                      {...register(
                        "description",
                        { required: true },
                        "description is required"
                      )}
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
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

export default ServiceTypeModal;
