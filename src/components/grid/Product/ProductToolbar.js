import React, {useEffect, useState, useContext} from "react";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Badge} from "primereact/badge";
import SelectImpas from "./SelectImpas";
import Offer from "./Offer";
import WhareHouseActions from "./WhareHouseActions";
import {ProductQuantityContext} from "@/_context/ProductGridContext";
import {useDispatch, useSelector} from "react-redux";
import {setMtrLines, setSelectedProducts} from "@/features/productsSlice";
import PickingNew from "./PickingNew";
import {InputNumber} from "primereact/inputnumber";
import SmallOrders from "./SmallOrders";
import {useToast} from "@/_context/ToastContext";


//TOOLBAR STUFF THAT DISPLAYS ON THE GRID:
const ProductToolbar = ({totalProducts}) => {
    return (
        <Toolbar className="product_toolbar" start={() => (
            <LeftSide totalProducts={totalProducts}/>
        )} end={RightSide}/>
    );
};

//TOOLBAR RIGHT SIDE:
const RightSide = () => {
    const {selectedProducts} = useSelector((state) => state.products);
    const CalculateBasket = () => {
        let total = 0;
        selectedProducts &&
        selectedProducts.forEach((item) => {
            total += parseInt(item.PRICER);
        });
        return (
            <p className="mr-3">
                Σύνολο:<span className="font-bold ml-1">{`${total},00$`}</span>{" "}
            </p>
        );
    };
    return (
        <div>
            <div className="basket-icon">
                <CalculateBasket/>
                <i
                    className="pi pi-shopping-cart p-overlay-badge"
                    style={{fontSize: "18px", marginRight: "10px"}}
                >
                    <Badge
                        value={selectedProducts == null ? "0" : selectedProducts?.length}
                    ></Badge>
                </i>
            </div>
        </div>
    );
};

//TOOLBAR LEFT SIDE:
const LeftSide = ({totalProducts}) => {
    const {activeIndex, setActiveIndex, visible, setVisible} = useContext(
        ProductQuantityContext
    );

    const {selectedProducts} = useSelector((state) => state.products);
    const [showMenu, setShowMenu] = useState(false);
    const onMultipleActions = () => {
        setActiveIndex(0);
        setVisible(true);
    };

    useEffect(() => {
        setActiveIndex(0);
    }, []);

    const customIcons = (
        <React.Fragment>
            {activeIndex !== 0 ? (
                <button
                    onClick={() => setActiveIndex(0)}
                    className="p-sidebar-icon p-link mr-2"
                >
                    <span className="pi pi-arrow-left"/>
                </button>
            ) : null}
        </React.Fragment>
    );

    return (
        <>
            <Button
                icon="pi pi-shopping-cart"
                label="Καλάθι Λειτουργειών"
                className="mr-2"
                onClick={onMultipleActions}
                aria-controls="popup_menu_right"
                aria-haspopup
                severity="warning"
                disabled={
                    selectedProducts === null || selectedProducts.length < 1
                }
            />
            <div>
                <span className="">Προϊόντα: </span>
                <span className="font-bold">{totalProducts}</span>
            </div>
            <Sidebar
                visible={visible}
                position="right"
                onHide={() => setVisible(false)}
                className="lg:w-5 sm:w-full md:w-20"
                icons={customIcons}
            >
                {activeIndex === 0 ? (
                    <>
                        <FirstScreen/>
                        <Button
                            label="Μenu"
                            icon="pi pi-bars"
                            className="surface-ground text-primary w-full  mt-3"
                            onClick={() => setShowMenu((prev) => !prev)}
                        />
                        {showMenu ? (
                            <div className="mt-1 grid">
                                <div className="col-12">
                                    <MenuBtn
                                        label="Αλλαγή Impa"
                                        onClick={() => setActiveIndex(2)}
                                    />
                                    <MenuBtn label="Προσφορά" onClick={() => setActiveIndex(3)}/>
                                    <MenuBtn
                                        label="Ποσοτική τροποποίηση αποθήκης"
                                        onClick={() => setActiveIndex(4)}
                                    />
                                    <MenuBtn
                                        label="Picking new"
                                        onClick={() => setActiveIndex(5)}
                                    />
                                    <MenuBtn
                                        label="Παραγγελία Μικρή"
                                        onClick={() => setActiveIndex(6)}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : null}
                {activeIndex !== 0 ? (
                    <SecondScreen>
                        {activeIndex === 2 ? <SelectImpas/> : null}
                        {activeIndex === 3 ? <Offer/> : null}
                        {activeIndex === 4 ? <WhareHouseActions/> : null}
                        {activeIndex === 5 ? <PickingNew/> : null}
                        {activeIndex === 6 ? <SmallOrders/> : null}
                    </SecondScreen>
                ) : null}
            </Sidebar>
        </>
    );
};

//FIRST SCREEN OF THE
const FirstScreen = () => {
    const {selectedProducts, mtrLines} = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const {setVisible} = useContext(
        ProductQuantityContext
    );

    const CalculateBasket = () => {
        let total = 0;
        mtrLines && mtrLines.forEach((item) => {
            total += item.TOTAL_PRICE
        })
        return (
            <p className="mr-3 ml-1">
                <span className="font-normal">Σύνολο:</span> {`${total},00$`}
            </p>
        );
    };

    const handleRemoveProducts = (MTRL) => {
        let newProducts = selectedProducts.filter((product) => product.MTRL !== MTRL);
        dispatch(setSelectedProducts(newProducts));
    }

    const handleRemoveAll = () => {
        dispatch(setSelectedProducts([]));
        setVisible(false);
    }
    return (
        <>
            <div className="flex align-items-center mb-2 mt-2">
                <h2>Επεξεργασία:</h2>
            </div>
            <div className="box">
                <DataTable
                    className="border-1 border-round-sm	border-50 w-full"
                    size="small"
                    scrollHeight="350px"
                    scrollable
                    showGridlines
                    value={selectedProducts}
                    footer={() => (
                        <div className="flex align-items-center justify-content-between  p-2">
                            <div className="flex justify-between">
                                <p className="mr-3 ">
                                    <span className="font-normal">Προϊόντα:</span>{" "}
                                    {`${selectedProducts !== null ? selectedProducts.length : 0}`}
                                </p>
                                <CalculateBasket/>
                            </div>
                            <Button
                                label="Διαγραφή Καλαθίου"
                                className="surface-ground text-primary"
                                onClick={handleRemoveAll}
                            />
                        </div>
                    )}
                >
                    <Column field="Προϊόν" header="Προϊόν" body={(props) => (
                        <ProductBasketTemplate
                            name={props.NAME}
                            categoryName={props.CATEGORY_NAME}
                            PRICER={props.PRICER}
                            MTRL={props.MTRL}
                        />
                    )}></Column>
                    <Column style={{width: "200px"}} align='center' field="Προϊόν" body={(props) => (
                        <Quantity PRICER={props.PRICER} MTRL={props.MTRL}/>
                    )}></Column>
                    <Column style={{width: "30px"}} align='center' field="Προϊόν" body={(props) => (
                        <div onClick={() => handleRemoveProducts(props.MTRL)}>
                            <i className="pi pi-trash text-red-300"></i>
                        </div>
                    )}></Column>
                </DataTable>
            </div>
        </>
    );
};

const SecondScreen = ({children}) => {
    return <div>{children}</div>;
};

const MenuBtn = ({label, onClick}) => {
    const selectedProducts = useSelector((state) => state.products.selectedProducts);
    const {showMessage} = useToast()
    const handleClick = () => {
        if (!selectedProducts.length) {
            showMessage({
                severity: "info",
                summary: "Προσοχή",
                message: "Δεν έχετε επιλέξει προϊόντα"
            })
            return;
        }
        onClick();
    }
    return (
        <Button
            onClick={handleClick}
            style={{textAlign: "left"}}
            icon="pi pi-arrow-right"
            className="surface-ground text-primary w-full mb-1"
            label={label}
            severity="warning"
        />
    );
};

const ProductBasketTemplate = ({name, categoryName, PRICER, MTRL,}) => {
    const {mtrLines} = useSelector((state) => state.products);
    const line = mtrLines.find((line) => line.MTRL === MTRL);
    const totalPrice = (line.QTY1 * PRICER).toFixed(2);
    return (
        <div className="flex align-items-center justify-content-between">
            <div>
                <div>
                    <p className="text-md text-900 font-semibold">{name}</p>
                </div>
                <div className="flex align-items-center">
                    <i
                        className="pi pi-tag"
                        style={{fontSize: "12px", marginRight: "3px", marginTop: "2px"}}
                    ></i>
                    <p className="text-xs">{categoryName}</p>
                </div>
                <span className="text-xs ml-1">Tιμή Σύνολο:</span>
                <span className="text-xs ml-2">{totalPrice},00$</span>
            </div>

        </div>
    );
};


const Quantity = ({MTRL}) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
        dispatch(setMtrLines({MTRL: MTRL, QTY1: newQuantity}));
    };

    return (
        <InputNumber
            value={quantity}
            size="small"
            min={1}
            onValueChange={(e) => handleQuantityChange(e.value)}
            showButtons
            buttonLayout="horizontal"
            decrementButtonClassName="p-button-secondary"
            incrementButtonClassName="p-button-secondary"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            inputStyle={{width: "70px", textAlign: "center"}}
        />
    )
}


export default ProductToolbar;
