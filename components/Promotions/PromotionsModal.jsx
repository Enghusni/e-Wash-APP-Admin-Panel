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
import { UserAPI } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  code: Joi.string().min(2).max(20).required().label("code"),
  description: Joi.string().min(2).max(100).required().label("description"),
  percentage: Joi.string().min(2).max(20).required().label("percentage"),
  validFrom: Joi.string().min(2).max(20).required().label("validFrom"),
  validTo: Joi.string().min(2).max(20).required().label("validTo"),

});

//component
const PromotionsModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  console.log(UserAPI);

  const defaultValues = {
    code: selectedRow?.code || "",
    description: selectedRow?.description || "",
    percentage: selectedRow?.percentage || "",
    validFrom: selectedRow?.validFrom || "",
    validTo: selectedRow?.validFrom || "",
    
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
    UserAPI,
    "Promotion Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    UserAPI,
    "Promotion Updated Successfully",
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
        code: selectedRow?.code || "",
        description: selectedRow?.description || "",
        percentage: selectedRow?.percentage || "",
        validFrom: selectedRow?.validFrom || "",
        validTo: selectedRow?.validTo || "",
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
            {!selectedRow ? "New Users" : "Update Users"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} className="mb-2">
                <Label className="form-label" for="code">
                  Code
                </Label>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="code"
                      placeholder="code"
                      {...register(
                        "code",
                        { required: true },
                        "code is required"
                      )}
                      invalid={errors.code && true}
                      {...field}
                    />
                  )}
                />
                {errors.code && (
                  <FormFeedback>{errors.code.message}</FormFeedback>
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
                <Label className="form-label" for="percentage">
                  percentage
                </Label>
                <Controller
                  name="percentage"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="percentage"
                      placeholder="percentage"
                      {...register(
                        "percentage",
                        { required: true },
                        "percentage is required"
                      )}
                      invalid={errors.percentage && true}
                      {...field}
                    />
                  )}
                />
                {errors.percentage && (
                  <FormFeedback>{errors.percentage.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="validFrom">
                  validFrom
                </Label>
                <Controller
                  name="validFrom"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="validFrom"
                      type="validFrom"
                      placeholder="validFrom"
                      {...register(
                        "validFrom",
                        { required: true },
                        "validFrom is required"
                      )}
                      invalid={errors.validFrom && true}
                      {...field}
                    />
                  )}
                />
                {errors.validFrom && (
                  <FormFeedback>{errors.validFrom.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} className="mb-2">
                <Label className="form-label" for="validTo">
                  validTo
                </Label>
                <Controller
                  name="validTo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="validTo"
                      type="validTo"
                      placeholder="validTo"
                      {...register(
                        "validTo",
                        { required: true },
                        "validTo is required"
                      )}
                      invalid={errors.validTo && true}
                      {...field}
                    />
                  )}
                />
                {errors.validFrom && (
                  <FormFeedback>{errors.validTo.message}</FormFeedback>
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

export default PromotionsModal;
