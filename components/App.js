import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Input, Tree, Layout, Row, Col, Button } from "antd";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import ProductItem from "./ProductItem";
import currency from "currency.js";
import {
  MinusOutlined,
  PlusOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
const ru = require("convert-layout/ru");
import getConfig from "next/config";
import translit from "latin-to-cyrillic";

const { Search } = Input;
const { hostname } = window.location;
const { publicRuntimeConfig } = getConfig();

let dev = false;

if (hostname == "localhost") {
  dev = true;
}

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const urlParams = new URLSearchParams(window.location.search);
  let dealId = urlParams.get("dealId") ?? 0;

  const loadItems = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get("dealId") ?? 0;
    let project = urlParams.get("project");
    let terminal = urlParams.get("terminal");

    if (!project) {
      project = "CHOPAR";
    }
    // if (dev) {
    const { data } = await axios.get(
      `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/get.product.categories?project=${project}&dealId=${dealId}`
    );
    if (data.result) {
      setCategories(data.result.items);
      setExpandedKeys(data.result.ids);
    }

    const { data: productsData } = await axios.get(
      `https://${
        publicRuntimeConfig.crmUrl
      }/rest/1/63dif6icpi61ci3f/get.product.list?project=${project}&dealId=${dealId}${
        terminal ? "&terminal=" + terminal : ""
      }`
    );
    if (productsData.result) {
      setProducts(productsData.result);
    }
    // } else {
    //   const locPath = window.location.pathname.match(/\/.*\/(\d+)\//);
    //   const { data } = await axios.get(
    //     `/ajax/get_transactions.php?orderId=${locPath[1]}`
    //   );
    //   console.log(data);

    //   if (data.data) {
    //     setItems(data.data);
    //   }
    // }
  };

  const loadRelatedItems = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get("dealId") ?? 0;
    let project = urlParams.get("project");
    let terminal = urlParams.get("terminal");
    let fuser = urlParams.get("fuser") ?? 0;

    if (!project) {
      project = "CHOPAR";
    }
    console.log("related items");
    const { data: productsData } = await axios.get(
      `https://${
        publicRuntimeConfig.crmUrl
      }/rest/1/63dif6icpi61ci3f/load.related.items?project=${project}&dealId=${dealId}${
        terminal ? "&terminal=" + terminal : ""
      }&fuser=${fuser}`
    );
    if (productsData.result) {
      setRelatedProducts(productsData.result);
    }
    // } else {
    //   const locPath = window.location.pathname.match(/\/.*\/(\d+)\//);
    //   const { data } = await axios.get(
    //     `/ajax/get_transactions.php?orderId=${locPath[1]}`
    //   );
    //   console.log(data);

    //   if (data.data) {
    //     setItems(data.data);
    //   }
    // }
  };

  const loadCart = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dealId = urlParams.get("dealId") ?? 0;
    let project = urlParams.get("project");
    let fuser = urlParams.get("fuser") ?? 0;

    if (!project) {
      project = "CHOPAR";
    }

    if (dealId) {
      const { data } = await axios.get(
        `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/load.cart?dealId=${dealId}&project=${project}&fuser=${fuser}`
      );
      setCartItems(data.result.items);
      setCartTotalPrice(data.result.totalPrice);
    } else {
      const { data } = await axios.get(
        `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/load.cart?project=${project}&fuser=${fuser}`
      );
      setCartItems(data.result.items);
      setCartTotalPrice(data.result.totalPrice);
    }
  };

  const increaseBasketItem = async (id) => {
    const urlParams = new URLSearchParams(window.location.search);
    let project = urlParams.get("project");
    let newCartItems = [...cartItems];
    if (newCartItems.length) {
      newCartItems.forEach((item) => {
        if (item.ID == id) {
          +item.UF_QUANTITY++;
        }
      });
      setCartItems(newCartItems);
    }
    const { data } = await axios.get(
      `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/increase.basket.item?rowId=${id}&quantity=1&project=${project}`
    );
    loadCart();
  };

  const decreaseBasketItem = async (id) => {
    const urlParams = new URLSearchParams(window.location.search);
    let project = urlParams.get("project");

    let newCartItems = [...cartItems];
    if (newCartItems.length) {
      newCartItems.forEach((item) => {
        if (item.ID == id && +item.UF_QUANTITY > 1) {
          +item.UF_QUANTITY--;
        }
      });
      setCartItems(newCartItems);
    }
    const { data } = await axios.get(
      `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/decrease.basket.item?rowId=${id}&quantity=1&project=${project}`
    );
    loadCart();
  };

  const deleteBasketItem = async (id) => {
    const urlParams = new URLSearchParams(window.location.search);
    let project = urlParams.get("project");
    const { data } = await axios.get(
      `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/delete.basket.item?rowId=${id}&project=${project}`
    );
    loadCart();
    loadRelatedItems();
  };

  const onTreeSelect = (selectedKeys) => {
    setSelectedKeys(selectedKeys);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      return (
        (searchVal.length && item.NAME.toLowerCase().indexOf(searchVal) >= 0) ||
        (searchVal.length &&
          item.NAME.toLowerCase().indexOf(translit(searchVal)) >= 0) ||
        (searchVal.length &&
          item.NAME.toLowerCase().indexOf(ru.fromEn(searchVal)) >= 0) ||
        (selectedKeys.length && selectedKeys.includes(+item.IBLOCK_SECTION_ID))
      );
    });
  }, [products, searchVal, selectedKeys]);

  const RowItem = ({ index, style }) => (
    <ProductItem
      style={style}
      product={filteredProducts[index]}
      loadCart={loadCart}
      loadRelatedItems={loadRelatedItems}
    />
  );

  const onSearch = (value) => setSearchVal(value);

  const removeModifier = async (item, mod) => {
    let modifiers = item.UF_MOFIDIERS;
    let activeModifiers = [];

    let existingModifier = modifiers.find((findMod) => findMod.ID == mod.ID);
    if (existingModifier) {
      activeModifiers = [
        ...modifiers
          .filter((findMod) => findMod.ID != mod.ID)
          .map((findMod) => findMod.ID),
      ];
    }

    const urlParams = new URLSearchParams(window.location.search);
    let project = urlParams.get("project");
    let fuser = urlParams.get("fuser");
    const { data } = await axios.get(
      `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/delete.basket.item?rowId=${item.ID}&project=${project}`
    );

    const rowData = {
      productId: item.UF_PRODUCT_ID,
    };
    rowData.modifiers = activeModifiers;

    const dealId = urlParams.get("dealId");
    if (dealId) {
      rowData.dealId = dealId;
    }
    if (project) {
      rowData.project = project;
    }
    if (fuser) {
      rowData.fuser = fuser;
    }
    await axios.post(
      `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/add.deal.basket.item`,
      rowData
    );

    loadCart();
  };

  const addToCart = async (productId, additional = false) => {
    const urlParams = new URLSearchParams(window.location.search);
    let project = urlParams.get("project");
    let fuser = urlParams.get("fuser");
    const rowData = {
      productId,
    };

    const dealId = urlParams.get("dealId");
    if (dealId) {
      rowData.dealId = dealId;
    }
    if (project) {
      rowData.project = project;
    }
    if (fuser) {
      rowData.fuser = fuser;
    }

    if (additional) {
      rowData.additional = true;
    }

    const { data } = await axios.post(
      `https://${publicRuntimeConfig.crmUrl}/rest/1/63dif6icpi61ci3f/add.deal.basket.item`,
      rowData
    );

    loadCart();
    loadRelatedItems();
  };

  const onChange = (e) => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    loadItems();
    loadCart();
    loadRelatedItems();
    return;
  }, []);
  return (
    <div className="p-3 bg-gray-100">
      <Layout className="bg-gray-100">
        <div className="py-2">
          <h3 className="font-bold uppercase text-xl pb-3">Товары в корзине</h3>
          {cartItems.length > 0 ? (
            <div>
              <div>
                {cartItems.map((item) => (
                  <div
                    className="px-3 py-1 rounded-md border bg-white flex justify-between items-center"
                    key={item.ID}
                  >
                    <div className="flex-grow">
                      <div className="font-bold text-md">
                        {item.UF_PRODUCT_NAME}
                      </div>
                      {item.UF_MOFIDIERS && (
                        <div className="text-sm">
                          Модификаторы:{" "}
                          {item.UF_MOFIDIERS.map((mod) => (
                            <div
                              key={mod.ID}
                              className=" text-[10px] inline-flex items-center font-bold leading-sm uppercase px-3 py-1 mx-1 bg-blue-200 text-blue-700 rounded-full"
                            >
                              {mod.NAME}
                              {!dealId && (
                                <Button
                                  type="primary"
                                  shape="circle"
                                  size="small"
                                  danger
                                  icon={<CloseOutlined />}
                                  className="ml-2"
                                  onClick={() => removeModifier(item, mod)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mx-8 w-20">
                      {currency(item.UF_PRICE, {
                        pattern: "# !",
                        separator: " ",
                        decimal: ".",
                        symbol: "",
                        precision: 0,
                      }).format()}
                    </div>
                    <div className="grid grid-cols-4 gap-1 items-center">
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={() => {
                          decreaseBasketItem(item.ID);
                        }}
                      ></Button>
                      <div className="py-1 px-3 border col-span-2 text-center">
                        {item.UF_QUANTITY}
                      </div>
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          increaseBasketItem(item.ID);
                        }}
                      ></Button>
                    </div>
                    <div className="mx-8 w-20">
                      {currency(+item.UF_PRICE * +item.UF_QUANTITY, {
                        pattern: "# !",
                        separator: " ",
                        decimal: ".",
                        symbol: "",
                        precision: 0,
                      }).format()}
                    </div>
                    <div>
                      <Button
                        type="text"
                        shape="circle"
                        size="small"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => {
                          deleteBasketItem(item.ID);
                        }}
                      ></Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex font-bold justify-end pt-2 text-xl">
                Итого:{" "}
                {currency(cartTotalPrice, {
                  pattern: "# !",
                  separator: " ",
                  decimal: ".",
                  symbol: "",
                  precision: 0,
                }).format()}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-gray-500 uppercase font-bold">
                Корзина пуста
              </h4>
            </div>
          )}
        </div>
        <div className="py-2">
          <h3 className="font-bold uppercase text-xl pb-3">
            Рекомендуемые товары
          </h3>
          <div className="flex space-x-2">
            {relatedProducts.length > 0 && (
              <>
                {relatedProducts.map((item) => (
                  <span
                    onClick={() => {
                      addToCart(item.PRODUCT_ID, true);
                    }}
                    class="px-4 py-1 rounded-full space-x-1 shadow-lg active:shadow-none text-white bg-blue-400 font-semibold text-xs flex align-center w-max cursor-pointer active:bg-blue-500 transition duration-300 ease items-center"
                  >
                    <span className="block">{item.NAME}</span>
                    <PlusCircleOutlined
                      style={{
                        fontSize: "20px",
                      }}
                    />
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
        <h3 className="font-bold uppercase text-xl pb-3">
          Добавить товары в корзину
        </h3>
        <Search
          placeholder="Поиск товара"
          onSearch={onSearch}
          onChange={onChange}
          enterButton
          allowClear
        />
        <Row gutter={16} className="pt-4">
          <Col span={6}>
            <Tree
              treeData={categories}
              key="ID"
              // selectable={true}
              autoExpandParent={true}
              showLine={true}
              className="p-3"
              titleRender={(item) => <div>{item.NAME}</div>}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              // onExpand={onTreeExpand}
              defaultExpandAll={true}
              onSelect={onTreeSelect}
            />
          </Col>
          <Col span={18}>
            <AutoSizer
              defaultHeight={500}
              style={{
                minHeight: 500,
              }}
            >
              {({ height, width }) => (
                <List
                  height={height}
                  itemCount={filteredProducts.length}
                  itemSize={70}
                  width={width}
                >
                  {RowItem}
                </List>
              )}
            </AutoSizer>
          </Col>
        </Row>
      </Layout>
    </div>
  );
}

export default App;
