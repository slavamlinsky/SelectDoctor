import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import MaskedInput from "react-text-mask";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../styles/style.css";
import styles from "./../App.module.scss";
import ErrorWarning from "./ErrorWarning";
import { getAge } from "../utils/utils";

const SelectDoctor = () => {
  const phoneNumberMask = [
    "+",
    /\d/,
    /\d/,
    "(",
    /[0-9]/,
    /\d/,
    /\d/,
    ")",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];

  const initialValues = {
    name: "",
    birthdayDate: null,
    sex: "0",
    city: "0",
    speciality: "0",
    doctor: "0",
    email: "",
    mobile: "",
  };

  const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      console.log("Start Submitting ...");
      console.log("Submitted Data", JSON.stringify(values, null, 2));
      console.log("End Submitting ...");
      setSubmitting(false);
    }, 1500);
  };

  const [age, setAge] = useState(0);
  const [cities, setCities] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "'Name' is required";
    } else if (
      !/^[A-Za-z_ \-\.\*]{3,30}$/i.test(values.name) //eslint-disable-line
    ) {
      errors.name = "(length 3 to 30) only letters, space and symbols - _ . *";
    }

    if (values.birthdayDate === null) {
      errors.birthdayDate = "'Birthday Date' is required";
    }

    if (values.sex === "0") {
      errors.sex = "'Sex' is required";
    }

    if (values.city === "0") {
      errors.city = "'City' is required";
    }

    if (values.doctor === "0") {
      errors.doctor = "'Doctor' is required";
    }

    if (!values.email && !values.mobile) {
      errors.email = "Either 'Email' or 'Phone' is required";
    }

    if (values.mobile && values.mobile.length < 17) {
      errors.mobile = "'Phone number' is not valid";
    }

    if (
      values.email &&
      //eslint-disable-next-line
      !/^[A-Za-z0-9_\-\.]+\@[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,4}$/i.test(
        values.email
      )
    ) {
      errors.email = "'Email address' is not valid";
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {function ShowForm({
        values,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        setFieldValue,
        setTouched,
      }) {
        useEffect(() => {
          fetch("https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4")
            .then((data) => data.json())
            .then((cities) => {
              setCities(cities);
            });
        }, []);

        useEffect(() => {
          fetch(" https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca")
            .then((data) => data.json())
            .then((specialities) => {
              setSpecialities(
                specialities
                  .filter((spec) => {
                    return (
                      age === 0 ||
                      ((spec?.params?.maxAge <= 16 ||
                        spec?.params?.maxAge === undefined) &&
                        age < 16 &&
                        (spec?.params?.minAge < 45 ||
                          spec?.params?.minAge === undefined)) ||
                      ((spec?.params?.maxAge > 16 ||
                        spec?.params?.maxAge === undefined) &&
                        age >= 16 &&
                        age < 45 &&
                        (spec?.params?.minAge < 45 ||
                          spec?.params?.minAge === undefined)) ||
                      ((spec?.params?.maxAge > 45 ||
                        spec?.params?.maxAge === undefined) &&
                        age >= 45 &&
                        (spec?.params?.minAge >= 45 ||
                          spec?.params?.minAge === undefined))
                    );
                  })
                  .filter((spec) => {
                    return (
                      (values.sex !== "0" &&
                        (spec?.params?.gender === values.sex ||
                          spec?.params?.gender === undefined)) ||
                      values.sex === "0"
                    );
                  })
              );
            });
        }, [values.sex, values.birthdayDate]);

        useEffect(() => {
          fetch("https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21")
            .then((data) => data.json())
            .then((doctors) => {
              setDoctors(
                doctors
                  .filter((doctor) => {                    
                    return (
                      age === 0 ||
                      (age < 16 && doctor.specialityId !== "12") ||
                      (age >= 16 &&
                        age <= 45 &&
                        doctor.specialityId !== "12" &&
                        doctor.specialityId !== "11") ||
                      (age > 45 && doctor.specialityId !== "11")
                    );
                    
                  })
                  .filter((doctor) => {
                    return (
                      age >= 18 ||
                      (age < 18 && doctor.isPediatrician !== false) ||
                      age === 0
                    );
                  })
                  .filter((doctor) => {
                    return (
                      values.sex === "0" ||
                      (values.sex === "Male" &&
                        doctor.specialityId !== "2" &&
                        doctor.specialityId !== "9") ||
                      (values.sex === "Female" && doctor.specialityId !== "3")
                    );
                  })
                  .filter((doctor) => {
                    return (
                      values.city === "0" ||
                      (values.city !== "0" && doctor.cityId === values.city)
                    );
                  })
                  .filter((doctor) => {
                    return (
                      values.speciality === "0" ||
                      doctor.specialityId === values.speciality
                    );
                  })
              );
            });
        }, [values.city, values.sex, values.birthdayDate, values.speciality]);

        return (
          <Form className={styles.form}>
            <div className={styles.formWrap}>
              <div className={styles.formControl}>
                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <Field
                  className={styles.field}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component={ErrorWarning} />
              </div>
              <div className={styles.formBirthDate}>
                <label className={styles.label}>Birthday Date</label>
                <DatePicker
                  autoComplete="off"
                  showDisabledMonthNavigation={true}
                  selected={values.birthdayDate}
                  maxDate={new Date()}
                  placeholderText={"dd/mm/yyyy"}
                  dateFormat="dd/MM/yyyy"
                  todayButton="Today"
                  calendarStartDay={1}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={40}
                  name="birthdayDate"
                  shouldCloseOnSelect="true"
                  onChange={(date) => {
                    setAge(getAge(date));
                    setFieldValue("birthdayDate", date);
                  }}
                  onBlur={handleBlur}
                  customInput={
                    <MaskedInput
                      mask={[
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                      ]}
                    />
                  }
                />
                <ErrorMessage name="birthdayDate" component={ErrorWarning} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                  />
                </svg>
              </div>
              <div className={styles.formControl}>
                <label className={styles.label}>Sex</label>
                <Field
                  name="sex"
                  as="select"
                  value={values.sex}
                  id="sex"
                  onChange={(e) => {
                    document.querySelector('[name="sex"]').blur();
                    setFieldValue("speciality", "0");
                    setFieldValue("doctor", "0");
                    setFieldValue("sex", e.target.value);
                  }}
                >
                  <option value="0">- Select your gender -</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Field>
                <ErrorMessage name="sex" component={ErrorWarning} />
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  stroke="currentColor"
                  fill="currentColor"
                >
                  <path d="M 8,5.5 11,9.5 14,5.5 z"></path>
                </svg>
              </div>
              <div className={styles.formControl}>
                <label className={styles.label}>City</label>
                <Field
                  name="city"
                  as="select"
                  value={values.city}
                  onChange={(e) => {
                    document.querySelector('[name="city"]').blur();
                    setFieldValue("speciality", "0");
                    setFieldValue("doctor", "0");
                    setFieldValue("city", e.target.value);
                  }}
                >
                  <option key="0" value="0">
                    - Select your city -
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="city" component={ErrorWarning} />
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  stroke="currentColor"
                  fill="currentColor"
                >
                  <path d="M 8,5.5 11,9.5 14,5.5 z"></path>
                </svg>
              </div>
            </div>
            <div className={styles.formWrap}>
              <div className={styles.formControl}>
                <label className={styles.label}>Doctor Speciality</label>
                <Field
                  name="speciality"
                  as="select"
                  value={values.speciality}
                  onChange={(e) => {
                    document.querySelector('[name="speciality"]').blur();
                    setFieldValue("speciality", e.target.value);
                    setFieldValue("doctor", "0");
                  }}
                >
                  <option key="0" value="0">
                    - Select doctor speciality -
                  </option>
                  {specialities.map((speciality) => (
                    <option key={speciality.id} value={speciality.id}>
                      {speciality.name}
                    </option>
                  ))}
                </Field>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  stroke="currentColor"
                  fill="currentColor"
                >
                  <path d="M 8,5.5 11,9.5 14,5.5 z"></path>
                </svg>
              </div>
              <div className={styles.formControl}>
                <label className={styles.label} htmlFor="doctor">
                  Doctor
                </label>
                <Field
                  name="doctor"
                  as="select"
                  value={values.doctor}
                  onChange={(e) => {                    
                    if (e.target.value !== "0") {
                      setFieldValue(
                        "city",
                        doctors.find((doctor) => doctor.id === e.target.value)
                          .cityId
                      );
                      setFieldValue(
                        "speciality",
                        doctors.find((doctor) => doctor.id === e.target.value)
                          .specialityId
                      );
                    }
                    document.querySelector('[name="doctor"]').blur();
                    setFieldValue("doctor", e.target.value);
                    validate("doctor");
                  }}
                >
                  <option key="0" value="0">
                    - Select doctor -
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} {doctor.surname}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="doctor" component={ErrorWarning} />
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  stroke="currentColor"
                  fill="currentColor"
                >
                  <path d="M 8,5.5 11,9.5 14,5.5 z"></path>
                </svg>
              </div>
            </div>
            <div className={styles.formWrap}>
              <div className={styles.formControl}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <Field
                  className={styles.field}
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component={ErrorWarning} />
              </div>
              <div className={styles.formControl}>
                <label htmlFor="mobile">Mobile number</label>
                <MaskedInput
                  mask={phoneNumberMask}
                  className="form-control"
                  placeholder="+38(___)___-____"
                  guide={false}
                  id="mobile"
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="mobile" component={ErrorWarning} />
              </div>
            </div>
            {isSubmitting && (
              <div className="text-center">
                <span className="loader"></span>
              </div>
            )}
            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SelectDoctor;
