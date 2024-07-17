"use client";

// import node module libraries
import { Row, Col, Card, Form, Button, Image, Spinner } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

//3rd party packages
import Joi from "joi";
import { Controller, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { FormFeedback, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { useLoginMutation } from "redux/auth/authApi";
import { setCredential } from "redux/auth/authSlice";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  password: Joi.string().label("Password"),
});

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (res.status) {
        dispatch(setCredential({ res: res?.data, router }));
        toast.success(res.message);
        router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      const message = err?.data
        ? err?.data?.message
        : "Unknown error, please try again";
      toast.error(message);
    }
  };

  useEffect(() => {
    router.prefetch("/");
  }, []);

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4 text-center">
              <Link href="/">
                <Image
                  width={150}
                  height={100}
                  src="/images/logo.png"
                  className="mb-2"
                  alt="logo"
                />
              </Link>
              <p className="mb-6">Please enter your user information.</p>
            </div>
            {/* Form */}
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Username */}
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="email"
                      placeholder="Enter address here"
                      {...register("email", { required: true })}
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="password"
                      placeholder="**************"
                      {...register("password", { required: true })}
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </Form.Group>

              {/* Checkbox */}
              <div className="d-lg-flex justify-content-between align-items-center mb-4">
                <Form.Check type="checkbox" id="rememberme">
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label>Remember me</Form.Check.Label>
                </Form.Check>
              </div>
              <div>
                {/* Button */}
                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading && <Spinner size="sm" className="me-2" />}
                    Sign In
                  </Button>
                </div>
                <div className="d-md-flex justify-content-between mt-4">
                  <div className="mb-2 mb-md-0">
                    {/* <Link href="/authentication/sign-up" className="fs-5">
                      Create An Account{" "}
                    </Link> */}
                  </div>
                  <div>
                    <Link
                      href="/authentication/forget-password"
                      className="text-inherit fs-5"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
