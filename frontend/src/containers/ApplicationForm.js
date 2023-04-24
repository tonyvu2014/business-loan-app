import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import {
  YEAR_ESTABLISHED_RANGE,
  STAGE,
  LOAN_OUTCOME,
} from '../common/constant';
import axios from 'axios';
import BalanceSheetCard from '../components/BalanceSheet';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formMessage, setFormMessage] = useState({});
  const [accountingProviders, setAccountingProviders] = useState([]);
  const [balanceSheet, setBalanceSheet] = useState({});
  const [stage, setStage] = useState(STAGE.INITIAL);

  const formRef = useRef();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const url = `${process.env.REACT_APP_API_URL}/accounting/providers`;
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setAccountingProviders(data);
      })
      .catch((error) => {
        console.log(error);
        setFormErrors({
          ...formErrors,
          accountingProvider: 'Error getting accounting providers',
        });
      });
  }, []);

  const setField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: null,
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.businessName) {
      errors.businessName = 'Business Name is required';
    }
    if (!formData.businessABN) {
      errors.businessABN = 'ABN is required';
    }
    if (!formData.yearEstablished) {
      errors.yearEstablished = 'Year Established is required';
    }
    if (!formData.loanAmount) {
      errors.loanAmount = 'Loan Amount is required';
    }
    if (!formData.accountingProvider) {
      errors.accountingProvider = 'Acconting Provider is required';
    }
    return errors;
  };

  const getBalanceSheet = async (abn, provider) => {
    // eslint-disable-next-line no-undef
    const url = `${process.env.REACT_APP_API_URL}/accounting/balance_sheet`;
    const sheet = await axios
      .get(url, { params: { abn, provider } })
      .then((response) => {
        const { data } = response;
        return data;
      });

    return sheet;
  };

  const requestOutcome = async (assessmentData) => {
    // eslint-disable-next-line no-undef
    const url = `${process.env.REACT_APP_API_URL}/decision/outcome`;
    const outcome = await axios.post(url, assessmentData).then((response) => {
      const { data } = response;
      return data;
    });

    return outcome;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (stage == STAGE.INITIAL) {
      const errors = validate();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      const { businessABN, accountingProvider } = formData;
      try {
        const balanceSheet = await getBalanceSheet(
          businessABN,
          accountingProvider,
        );
        setBalanceSheet(balanceSheet);
        setFormMessage({
          type: 'info',
          message:
            'Please review your balance sheet below and click Submit to finalise the application',
        });
        setStage(STAGE.REVIEWING);
      } catch (err) {
        console.log('Error getting balance sheet', err);
        setFormMessage({
          type: 'danger',
          message: 'Error getting balance sheet',
        });
      }
    }
  };

  const handleRestart = async (e) => {
    e.preventDefault();
    setFormData({});
    setFormMessage({});
    setFormErrors({});
    formRef.current.reset();
    setStage(STAGE.INITIAL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stage == STAGE.REVIEWING) {
      const assessmentData = {
        name: formData.businessName,
        abn: formData.businessABN,
        yearEstablished: formData.yearEstablished,
        loanAmount: formData.loanAmount,
        accountingProvider: formData.accountingProvider,
        balanceSheet,
      };
      try {
        const result = await requestOutcome(assessmentData);
        setStage(STAGE.DONE);
        const { outcome } = result;
        if (outcome == LOAN_OUTCOME.APPROVED) {
          setFormMessage({
            type: 'success',
            message: 'Your loan application is successful. Congratulations!',
          });
        } else {
          setFormMessage({
            type: 'warning',
            message: "We're sorry your loan application is rejected",
          });
        }
      } catch (err) {
        console.log('Error submitting application', err);
        setFormMessage({
          type: 'danger',
          message: 'Error submitting application',
        });
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: YEAR_ESTABLISHED_RANGE },
    (_, i) => currentYear - i,
  );

  return (
    <Form className="my-3 fs-4" ref={formRef}>
      <h2>Business Loan Application</h2>
      {formMessage.message && (
        <Alert variant={formMessage.type}>{formMessage.message}</Alert>
      )}
      <Form.Group className="mt-3" controlId="businessName">
        <Form.Label>Business Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Your Business Name"
          onChange={(e) => setField('businessName', e.target.value)}
          isInvalid={!!formErrors.businessName}
        />
        <Form.Control.Feedback type="invalid">
          {formErrors.businessName}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mt-3" controlId="abn">
        <Form.Label>ABN</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Your Business ABN"
          onChange={(e) => setField('businessABN', e.target.value)}
          isInvalid={!!formErrors.businessABN}
        />
        <Form.Control.Feedback type="invalid">
          {formErrors.businessABN}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mt-3" controlId="yearEstablished">
        <Form.Label>Year Established</Form.Label>
        <Form.Control
          as="select"
          placeholder="--Select Year Established--"
          onChange={(e) => setField('yearEstablished', e.target.value)}
          isInvalid={!!formErrors.yearEstablished}
        >
          <option value="">--Select Year Established--</option>
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formErrors.yearEstablished}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mt-3" type="number" controlId="loanAmount">
        <Form.Label>Loan Amount ($)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Loan Amount"
          onChange={(e) => setField('loanAmount', e.target.value)}
          isInvalid={!!formErrors.loanAmount}
        />
        <Form.Control.Feedback type="invalid">
          {formErrors.loanAmount}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mt-3" controlId="accountingProvider">
        <Form.Label>Accounting Provider</Form.Label>
        <Form.Control
          as="select"
          placeholder="Select Accounting Provider"
          onChange={(e) => setField('accountingProvider', e.target.value)}
          isInvalid={!!formErrors.accountingProvider}
        >
          <option value="">--Select Accounting Provider--</option>
          {accountingProviders.map((provider) => (
            <option key={provider.id} value={provider.name}>
              {provider.name}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {formErrors.accountingProvider}
        </Form.Control.Feedback>
      </Form.Group>
      {stage == STAGE.REVIEWING && (
        <BalanceSheetCard balanceSheet={balanceSheet} />
      )}
      <Form.Group className="mt-3">
        {stage == STAGE.INITIAL && (
          <Button
            className="mx-2"
            variant="primary"
            type="button"
            onClick={(e) => handleApply(e)}
          >
            Apply
          </Button>
        )}
        {stage !== STAGE.INITIAL && (
          <Button
            className="mx-2"
            variant="secondary"
            type="button"
            onClick={(e) => handleRestart(e)}
          >
            Start Over
          </Button>
        )}
        {stage == STAGE.REVIEWING && (
          <Button
            className="mx-2"
            variant="primary"
            type="button"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </Button>
        )}
      </Form.Group>
    </Form>
  );
};

export default ApplicationForm;
