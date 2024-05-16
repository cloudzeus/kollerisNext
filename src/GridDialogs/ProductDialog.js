"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Input from "@/components/Forms/PrimeInput";
import { TextAreaInput } from "@/components/Forms/PrimeInput";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { FormTitle, Divider, Container } from "@/componentsStyles/dialogforms";
import { Dropdown } from "primereact/dropdown";
import { useSession } from "next-auth/react";
import TranslateInput from "@/components/Forms/TranslateInpit";
import { setSubmitted } from "@/features/productsSlice";
import PrimeInputNumber from "@/components/Forms/PrimeInputNumber";
import CountriesDropdown from "@/components/Forms/CountriesDropdown";
import VatDropdown from "@/components/Forms/VatDropdown";

const EditDialog = ({ dialog, hideDialog }) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [englishDescription, setEnglishDescription] = useState("");
  const toast = useRef(null);
  const { gridRowData } = useSelector((store) => store.grid);
  const [selectState, setSelectState] = useState({
    category: null,
    group: null,
    subgroup: null,
    vat: null,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: gridRowData,
  });

  const handleEnglish = async (value) => {
    setEnglishDescription(value);
  };

  useEffect(() => {
    // Reset the form values with defaultValues when gridRowData changes
    reset({ ...gridRowData });
    setEnglishDescription(gridRowData?.DESCRIPTION_ENG);
    setSelectState({
      category: {
        categoryName: gridRowData?.CATEGORY_NAME,
        softOne: { MTRCATEGORY: gridRowData?.MTRCATEGORY },
      },
      group: {
        groupName: gridRowData?.GROUP_NAME,
        softOne: { MTRGROUP: gridRowData?.MTRGROUP },
      },
      subgroup: {
        subGroupName: gridRowData?.SUBGROUP_NAME,
        softOne: { cccSubgroup2: gridRowData?.CCCSUBGROUP2 },
      },
      vat: { VAT: gridRowData?.VAT },
    });
  }, [gridRowData, reset]);

  const handleEdit = async (data) => {
    let user = session.user.user.lastName;

    try {
      let resp = await axios.post("/api/product/apiProduct", {
        action: "update",
        data: {
          ...data,
          DESCRIPTION_ENG: englishDescription,
          ...selectState,
        },
      });
      if (!resp.data.success) {
        showError(resp.data?.error);
        return;
      }
      dispatch(setSubmitted());
      hideDialog();
      showSuccess(resp.data.systemMessage + " " + resp.data.softoneMessage);
    } catch (e) {
      showError("Αποτυχία. Προσπαθήστε ξανά");
    }
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 4000,
    });
  };
  const showError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 4000,
    });
  };

  const handleClose = () => {
    hideDialog();
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Ακύρωση"
        icon="pi pi-times"
        severity="info"
        outlined
        onClick={handleClose}
      />
      <Button
        label="Αποθήκευση"
        icon="pi pi-check"
        severity="info"
        onClick={handleSubmit(handleEdit)}
      />
    </React.Fragment>
  );

  return (
    <Container>
      <form>
        <Toast ref={toast} />
        <Dialog
          visible={dialog}
          style={{ width: "32rem", maxWidth: "80rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Τροποποίηση Κατασκευαστή"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
          maximizable
        >
          {/* <Categories
                        state={selectState.category}
                        setState={setSelectState}
                    />
                    <Groups
                        state={selectState.group}
                        setState={setSelectState}
                        id={selectState.category?.softOne?.MTRCATEGORY}
                    />
                    <SubGroups
                        state={selectState.subgroup}
                        setState={setSelectState}
                        id={selectState.group?.softOne?.MTRGROUP}
                    /> */}
          <OptionsVat state={selectState.vat} setState={setSelectState} />
          <FormTitle>Λεπτομέριες</FormTitle>
          <Input
            label={"Όνομα"}
            name={"NAME"}
            control={control}
            required
            //    error={errors.NAME}
          />
          <TextAreaInput
            autoResize={true}
            label={"Ελληνική Περιγραφή"}
            name={"DESCRIPTION"}
            control={control}
          />
          <TranslateInput
            label={"Περιγραφή Aγγλική"}
            state={englishDescription}
            handleState={handleEnglish}
            targetLang="en-GB"
          />

          <PrimeInputNumber
            label={"Τιμή Κόστους"}
            name={"COST"}
            control={control}
            required
            error={errors.cost}
          />
          <PrimeInputNumber
            label={"Τιμή Λιανικής"}
            name={"PRICER"}
            control={control}
          />

          <PrimeInputNumber
            label={"Τιμή Αποθήκης"}
            name={"PRICEW"}
            control={control}
          />

          <PrimeInputNumber
            label={"Τιμή Skroutz"}
            name={"PRICE01"}
            control={control}
          />

          <Input label={"ΕΑΝCODE"} name={"CODE1"} control={control} />
          <Input label={"Κωδικός Προϊόντος"} name={"CODE2"} control={control} />
        </Dialog>
      </form>
    </Container>
  );
};

const addSchema = yup.object().shape({
  // name: yup.string().required('Συμπληρώστε το όνομα'),
  NAME: yup.string().required("Συμπληρώστε το όνομα"),
  VAT: yup.object().shape({
    VAT: yup.string().required("Συμπληρώστε το ΦΠΑ"),
  }),
  COUNTRY: yup.object().shape({
    COUNTRY: yup.string().required("Συμπληρώστε την χώρα"),
  })
});

const AddDialog = ({ dialog, hideDialog }) => {
  const dispatch = useDispatch();
  const [showInputs, setShowInputs] = useState(false);
  const [englishDescription, setEnlgishDescription] = useState("");
  const [selectState, setSelectState] = useState({
    category: null,
    group: null,
    subgroup: null,
    vat: null,
  });

  const methods = useForm({
    resolver: yupResolver(addSchema),
    defaultValues: {
      NAME: "",
      DESCRIPTION: "",
      CODE: "",
      CODE1: "",
      CODE2: "",
      PRICER: 0,
      PRICEW: 0,
      PRICER01: 0,
      COST: 0,
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = methods;
  const values = methods.getValues();

  const toast = useRef(null);



  useEffect(() => {
    if (selectState.category && selectState.group) setShowInputs(true);
    else setShowInputs(false);
  }, [selectState]);

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 4000,
    });
  };
  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Αποτυχία ενημέρωσης βάσης",
      life: 4000,
    });
  };

  const handleClose = () => {
    hideDialog();
  };

  const handleAdd = async (data) => {

    let _data = {
        ...data,
        COUNTRY: data.COUNTRY.COUNTRY,
        VAT: data.VAT.VAT,
        //needs refactoring:
        MTRCATEGORY: selectState.category?.softOne?.MTRCATEGORY,
        CATEGORY_NAME: selectState.category?.categoryName,
        MTRGROUP: selectState.group?.softOne?.MTRGROUP,
        GROUP_NAME: selectState.group?.groupName,
        CCCSUBGROUP2: selectState.subgroup?.softOne?.cccSubgroup2,
        SUBGROUP_NAME: selectState.subgroup?.subGroupName,
        DESCRIPTION_ENG: englishDescription,

    }
    console.log({_data})
    return;
    let res = await axios.post("/api/product/apiProduct", {
      action: "create",
      data:_data,
    });
    console.log('data')
    console.log(res.data)
    hideDialog();
    dispatch(setSubmitted());
    reset();
  };


  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Ακύρωση"
        icon="pi pi-times"
        severity="info"
        outlined
        onClick={handleClose}
      />
      <Button
        label="Αποθήκευση"
        icon="pi pi-check"
        severity="info"
        onClick={handleSubmit(handleAdd)}
      />
    </React.Fragment>
  );

  const handleEnglish = async (value) => {
    setEnlgishDescription(value);
  };

    const handleVatState = (e) => {
        let value = e.target.value;
        setValue("VAT", value);
    }
    const handleCountryChange = (e) => {
      let value = e.target.value;
      setValue("COUNTRY", value);
    };

  return (
    <Container>
      <form noValidate onSubmit={handleSubmit(handleAdd)}>
        <Toast ref={toast} />
        <Dialog
          visible={dialog}
          style={{ width: "40rem", maxWidth: "80rem", minHeight: "40vh" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Προσθήκη Προϊόντος"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
          maximizable
        >
          <FormTitle>ΚΑΤΗΓΟΡΙΟΠΟΙΗΣΗ:</FormTitle>
          <Categories state={selectState.category} setState={setSelectState} />
          <Groups
            state={selectState.group}
            setState={setSelectState}
            id={selectState.category?.softOne?.MTRCATEGORY}
          />
          <SubGroups
            state={selectState.subgroup}
            setState={setSelectState}
            id={selectState.group?.softOne?.MTRGROUP}
          />

          <div>
            {showInputs ? (
              <div>
                <VatDropdown 
                    state={values.VAT} 
                    handleState={handleVatState} 
                    // error={errors?.VAT?.VAT}
                    /> 
                {/* <OptionsVat state={selectState.vat} setState={setSelectState} /> */}
                <CountriesDropdown
                  selectedCountry={values.COUNTRY}
                  onChangeCountry={handleCountryChange}
                />
                <FormTitle>ΠΕΡΙΓΡΑΦΗ:</FormTitle>
                <Input
                  label={"Όνομα"}
                  name={"NAME"}
                  control={control}
                  required
                  error={errors.NAME}
                />
                <TextAreaInput
                  autoResize={true}
                  label={"Ελληνική Περιγραφή"}
                  name={"DESCRIPTION"}
                  control={control}
                />

                <TranslateInput
                  label={"Περιγραφή Aγγλική"}
                  state={englishDescription}
                  handleState={handleEnglish}
                  targetLang="en-GB"
                />
                <FormTitle>ΤΙΜΕΣ:</FormTitle>
                <PrimeInputNumber
                  label={"Τιμή Κόστους"}
                  name={"COST"}
                  control={control}
                  required
                  error={errors.cost}
                />
                <PrimeInputNumber
                  label={"Τιμή Λιανικής"}
                  name={"PRICER"}
                  control={control}
                />

                <PrimeInputNumber
                  label={"Τιμή Αποθήκης"}
                  name={"PRICEW"}
                  control={control}
                />
                <PrimeInputNumber
                  label={"Τιμή Scroutz"}
                  name={"PRICER01"}
                  control={control}
                />
                <Input label={"ΕAN CODE"} name={"CODE1"} control={control} />
                <Input
                  label={"Kωδικός Προϊόντος"}
                  name={"CODE2"}
                  control={control}
                  required
                />
              </div>
            ) : null}
          </div>
        </Dialog>
      </form>
    </Container>
  );
};

const Categories = ({ state, setState }) => {
  const [options, setOptions] = useState([]);
  const handleFetch = async () => {
    let { data } = await axios.post("/api/product/apiProductFilters", {
      action: "findCategories",
    });
    setOptions(data.result);
  };
  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="card mb-3">
      <span className="mb-2 block">Επιλογή Ομάδας</span>
      <div className="flex align-items-center">
        <Dropdown
          value={state}
          onChange={(e) => setState((prev) => ({ ...prev, category: e.value }))}
          options={options}
          optionLabel="categoryName"
          placeholder="Κατηγορία"
          className="w-full"
        />
      </div>
    </div>
  );
};

const Groups = ({ state, setState, id }) => {
  const [groupOptions, setGroupOptions] = useState([]);

  const handleFetch = async () => {
    let { data } = await axios.post("/api/product/apiProductFilters", {
      action: "findGroups",
      categoryID: id,
    });
    setGroupOptions(data.result);
  };
  useEffect(() => {
    handleFetch();
  }, [id]);

  return (
    <div className="card mb-3">
      <span className="mb-2 block">Επιλογή Ομάδας</span>
      <Dropdown
        value={state}
        onChange={(e) => setState((prev) => ({ ...prev, group: e.value }))}
        options={groupOptions}
        optionLabel="groupName"
        placeholder="Κατηγορία"
        className="w-full"
      />
    </div>
  );
};
const SubGroups = ({ state, setState, id }) => {
  const [subgroupOptions, setsubGroupOptions] = useState([]);
  const handleFetch = async () => {
    let { data } = await axios.post("/api/product/apiProductFilters", {
      action: "findSubGroups",
      groupID: id,
    });

    setsubGroupOptions(data.result);
  };
  useEffect(() => {
    handleFetch();
  }, [id]);

  return (
    <div className="card mb-3">
      <span className="mb-2 block">Επιλογή Υποομάδας</span>
      <Dropdown
        value={state}
        onChange={(e) => setState((prev) => ({ ...prev, subgroup: e.value }))}
        options={subgroupOptions}
        optionLabel="subGroupName"
        placeholder="Yποομάδα"
        className="w-full"
      />
    </div>
  );
};



const OptionsVat = ({ state, handleState }) => {
  const [options, setOptions] = useState([]);
//   const [data, setData] = useState([]);

//   const VatTemplate = (option) => {
//     for (let item of data) {
//       if (item.VAT === option.VAT) {
//         return <p>{item.NAME}</p>;
//       }
//     }

//     return (
//       <div className="flex align-items-center">
//         <div>{option.VAT}</div>
//       </div>
//     );
//   };

  const handleFetch = async () => {
    let { data } = await axios.post("/api/product/apiProductFilters", {
      action: "findVats",
    });
    setOptions(data.result);
  };
  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="card mb-3">
      <span className="mb-2 block">Aλλαγή ΦΠΑ</span>

      <Dropdown
        value={state}
        onChange={(e) => setState((prev) => ({ ...prev, vat: e.value }))}
        options={options}
        optionLabel="NAME"
        placeholder="ΦΠΑ"
        className="w-full"
      />
    </div>
  );
};

export { EditDialog, AddDialog };
