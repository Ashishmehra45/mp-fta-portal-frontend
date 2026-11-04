/**
 * Madhya Pradesh export statistics — OFFICIAL FIGURES (not demonstration data).
 *
 * Generated from export data extracts supplied to the portal on 23 Oct 2026:
 *  - MP exports by principal commodity, FY 2025-26 (US$ million and ₹ crore)
 *  - MP exports by principal commodity, month-wise, FY 2025-26
 *  - India exports by principal commodity, FY 2025-26 (used for MP's national share)
 *  - State-wise export share (calendar 2025 and 2026 year to date)
 * Replace this file when newer extracts are released; do not edit figures by hand.
 */

export const mpExportSource = {
  label: 'State-wise export statistics by principal commodity (export data extracts supplied to the portal)',
  extractedOn: '2026-10-23',
  fiscalYear: 'FY 2025-26',
  stateYears: { full: '2025', ytd: '2026 (YTD)' },
};

export interface MpProductExport { name: string; sector: string; usdMn: number; inrCr: number; indiaUsdMn: number }
export interface MpMonthlyExport { month: string; year: number; usdMn: number; inrCr: number }
export interface StateExport { state: string; usdMn2025: number; usdMn2026Ytd: number; share2026: number }

/** India's total exports across all principal commodities, FY 2025-26 (US$ million). */
export const indiaTotalUsdMn2526 = 441452.15;

/** MP exports by principal commodity, FY 2025-26, sorted by value. */
export const mpProducts: MpProductExport[] = [
  {
    "name": "Drug Formulations, Biologicals",
    "sector": "Drugs and Pharmaceuticals",
    "usdMn": 1494.28,
    "inrCr": 13217.63,
    "indiaUsdMn": 24630.12
  },
  {
    "name": "Aluminium, Products of Aluminium",
    "sector": "Engineering Goods",
    "usdMn": 448.63,
    "inrCr": 3979.3,
    "indiaUsdMn": 7063.04
  },
  {
    "name": "Cotton Fabrics, Madeups etc.",
    "sector": "Cotton Yarn/Fabs./Madeups, Handloom Products etc.",
    "usdMn": 404.54,
    "inrCr": 3566.06,
    "indiaUsdMn": 6696.92
  },
  {
    "name": "Cotton Yarn",
    "sector": "Cotton Yarn/Fabs./Madeups, Handloom Products etc.",
    "usdMn": 403.19,
    "inrCr": 3564.87,
    "indiaUsdMn": 3397.89
  },
  {
    "name": "Oil Meals",
    "sector": "Oil Meals",
    "usdMn": 395.11,
    "inrCr": 3476.45,
    "indiaUsdMn": 1041.16
  },
  {
    "name": "Rice (Basmati)",
    "sector": "Rice",
    "usdMn": 347.49,
    "inrCr": 3063.31,
    "indiaUsdMn": 5672.89
  },
  {
    "name": "Man-made Yarn, Fabrics, Madeups",
    "sector": "Man-Made Yarn/Fabs./Madeups etc.",
    "usdMn": 280.44,
    "inrCr": 2477.78,
    "indiaUsdMn": 4830.83
  },
  {
    "name": "IC Engines and Parts",
    "sector": "Engineering Goods",
    "usdMn": 240.48,
    "inrCr": 2122.97,
    "indiaUsdMn": 4115.93
  },
  {
    "name": "Residual Chemical and Allied Products",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 224.64,
    "inrCr": 1985.33,
    "indiaUsdMn": 8427.7
  },
  {
    "name": "Other Construction Machinery",
    "sector": "Engineering Goods",
    "usdMn": 205.41,
    "inrCr": 1817.22,
    "indiaUsdMn": 3622.99
  },
  {
    "name": "Bulk Drugs, Drug Intermediates",
    "sector": "Drugs and Pharmaceuticals",
    "usdMn": 195.7,
    "inrCr": 1734.24,
    "indiaUsdMn": 5095.82
  },
  {
    "name": "Pulses",
    "sector": "Others",
    "usdMn": 195.69,
    "inrCr": 1729.99,
    "indiaUsdMn": 947.33
  },
  {
    "name": "Electric Machinery and Equipment",
    "sector": "Engineering Goods",
    "usdMn": 192.65,
    "inrCr": 1699.62,
    "indiaUsdMn": 15364.61
  },
  {
    "name": "Plastic Sheet, Film, Plates etc",
    "sector": "Plastic and Linoleum",
    "usdMn": 161.31,
    "inrCr": 1424.48,
    "indiaUsdMn": 1872.53
  },
  {
    "name": "AC, Refrigeration Machinery etc",
    "sector": "Engineering Goods",
    "usdMn": 158.21,
    "inrCr": 1395.18,
    "indiaUsdMn": 2311.41
  },
  {
    "name": "Motor Vehicle/Cars",
    "sector": "Engineering Goods",
    "usdMn": 147.08,
    "inrCr": 1303.02,
    "indiaUsdMn": 11086.51
  },
  {
    "name": "Rice (Other than Basmati)",
    "sector": "Rice",
    "usdMn": 141.77,
    "inrCr": 1244.86,
    "indiaUsdMn": 5864.46
  },
  {
    "name": "Miscellaneous Processed Items",
    "sector": "Cereal Preparations and Miscellaneous Processed Item",
    "usdMn": 126.81,
    "inrCr": 1122.85,
    "indiaUsdMn": 1706.27
  },
  {
    "name": "Organic Chemicals",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 122.22,
    "inrCr": 1082.76,
    "indiaUsdMn": 7684.0
  },
  {
    "name": "Auto Components/Parts",
    "sector": "Engineering Goods",
    "usdMn": 114.05,
    "inrCr": 1007.77,
    "indiaUsdMn": 8564.1
  },
  {
    "name": "Dairy Products",
    "sector": "Meat, Dairy and Poultry Products",
    "usdMn": 99.17,
    "inrCr": 874.89,
    "indiaUsdMn": 633.6
  },
  {
    "name": "Products of Iron and Steel",
    "sector": "Engineering Goods",
    "usdMn": 92.01,
    "inrCr": 812.39,
    "indiaUsdMn": 10362.46
  },
  {
    "name": "Iron and Steel",
    "sector": "Engineering Goods",
    "usdMn": 88.41,
    "inrCr": 782.21,
    "indiaUsdMn": 10316.57
  },
  {
    "name": "Auto Tyres and Tubes",
    "sector": "Engineering Goods",
    "usdMn": 78.0,
    "inrCr": 689.95,
    "indiaUsdMn": 3199.75
  },
  {
    "name": "Spices",
    "sector": "Spices",
    "usdMn": 74.19,
    "inrCr": 657.0,
    "indiaUsdMn": 4261.67
  },
  {
    "name": "Fresh Fruits",
    "sector": "Fruits and Vegetables",
    "usdMn": 66.09,
    "inrCr": 586.9,
    "indiaUsdMn": 1325.01
  },
  {
    "name": "Industrial Machinery For Dairy etc",
    "sector": "Engineering Goods",
    "usdMn": 61.61,
    "inrCr": 544.96,
    "indiaUsdMn": 9023.2
  },
  {
    "name": "Man-made Staple Fibre",
    "sector": "Cotton Yarn/Fabs./Madeups, Handloom Products etc.",
    "usdMn": 58.11,
    "inrCr": 512.71,
    "indiaUsdMn": 402.97
  },
  {
    "name": "Other Misc. Engineering Items",
    "sector": "Engineering Goods",
    "usdMn": 53.58,
    "inrCr": 473.49,
    "indiaUsdMn": 5308.77
  },
  {
    "name": "Other Commodities",
    "sector": "Others",
    "usdMn": 47.8,
    "inrCr": 422.91,
    "indiaUsdMn": 5262.96
  },
  {
    "name": "Copper and Products made of Copper",
    "sector": "Engineering Goods",
    "usdMn": 45.87,
    "inrCr": 406.42,
    "indiaUsdMn": 3694.5
  },
  {
    "name": "Pumps of All Types",
    "sector": "Engineering Goods",
    "usdMn": 44.68,
    "inrCr": 394.74,
    "indiaUsdMn": 1632.21
  },
  {
    "name": "Graphite, Explosives and Accessories",
    "sector": "Others",
    "usdMn": 44.25,
    "inrCr": 392.18,
    "indiaUsdMn": 714.56
  },
  {
    "name": "Handicrafts (Excluding Handmade Carpets)",
    "sector": "Handicrafts excl. Hand made Carpet",
    "usdMn": 42.5,
    "inrCr": 375.0,
    "indiaUsdMn": 1792.66
  },
  {
    "name": "Sesame Seeds",
    "sector": "Oil Seeds",
    "usdMn": 42.31,
    "inrCr": 372.1,
    "indiaUsdMn": 423.49
  },
  {
    "name": "Other Textile Yarn, Fabric Madeup Articles",
    "sector": "Cotton Yarn/Fabs./Madeups, Handloom Products etc.",
    "usdMn": 39.99,
    "inrCr": 353.36,
    "indiaUsdMn": 935.53
  },
  {
    "name": "Bulk Minerals and Ores",
    "sector": "Mica, Coal and other Ores, Minerals including Process",
    "usdMn": 39.9,
    "inrCr": 357.05,
    "indiaUsdMn": 684.72
  },
  {
    "name": "Cotton Raw including Waste",
    "sector": "Others",
    "usdMn": 36.68,
    "inrCr": 324.83,
    "indiaUsdMn": 560.72
  },
  {
    "name": "Other Oil Seeds",
    "sector": "Oil Seeds",
    "usdMn": 36.13,
    "inrCr": 319.22,
    "indiaUsdMn": 92.92
  },
  {
    "name": "Other Cereals",
    "sector": "Other Cereals",
    "usdMn": 35.81,
    "inrCr": 323.08,
    "indiaUsdMn": 445.67
  },
  {
    "name": "RMG Cotton including Accessories",
    "sector": "RMG of All Textiles",
    "usdMn": 35.27,
    "inrCr": 312.52,
    "indiaUsdMn": 9486.59
  },
  {
    "name": "Alcoholic Beverages",
    "sector": "Others",
    "usdMn": 33.88,
    "inrCr": 297.75,
    "indiaUsdMn": 364.7
  },
  {
    "name": "Plastic Raw Materials",
    "sector": "Plastic and Linoleum",
    "usdMn": 33.72,
    "inrCr": 297.12,
    "indiaUsdMn": 2755.92
  },
  {
    "name": "Packaging Materials",
    "sector": "Plastic and Linoleum",
    "usdMn": 26.86,
    "inrCr": 237.23,
    "indiaUsdMn": 1198.64
  },
  {
    "name": "RMG of other Textile Material",
    "sector": "RMG of All Textiles",
    "usdMn": 24.3,
    "inrCr": 214.78,
    "indiaUsdMn": 3431.61
  },
  {
    "name": "Paper, Paper Board and Product",
    "sector": "Others",
    "usdMn": 23.47,
    "inrCr": 206.96,
    "indiaUsdMn": 2694.75
  },
  {
    "name": "Granite, Natural Stone and Products",
    "sector": "Mica, Coal and other Ores, Minerals including Process",
    "usdMn": 23.25,
    "inrCr": 206.15,
    "indiaUsdMn": 1920.92
  },
  {
    "name": "Cosmetics and Toiletries",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 23.17,
    "inrCr": 205.06,
    "indiaUsdMn": 2729.66
  },
  {
    "name": "Cereal Preparations",
    "sector": "Cereal Preparations and Miscellaneous Processed Item",
    "usdMn": 20.44,
    "inrCr": 181.1,
    "indiaUsdMn": 1006.95
  },
  {
    "name": "Electronics Components",
    "sector": "Electronic Goods",
    "usdMn": 19.49,
    "inrCr": 172.32,
    "indiaUsdMn": 5511.34
  },
  {
    "name": "Moulded and Extruded Goods",
    "sector": "Plastic and Linoleum",
    "usdMn": 19.1,
    "inrCr": 168.12,
    "indiaUsdMn": 1664.73
  },
  {
    "name": "Inorganic Chemicals",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 17.83,
    "inrCr": 157.14,
    "indiaUsdMn": 2408.69
  },
  {
    "name": "Ceramics and Allied Products",
    "sector": "Ceramic Products and Glassware",
    "usdMn": 17.08,
    "inrCr": 152.09,
    "indiaUsdMn": 2848.4
  },
  {
    "name": "Milled Products",
    "sector": "Cereal Preparations and Miscellaneous Processed Item",
    "usdMn": 17.07,
    "inrCr": 151.6,
    "indiaUsdMn": 178.57
  },
  {
    "name": "Surgicals",
    "sector": "Drugs and Pharmaceuticals",
    "usdMn": 16.61,
    "inrCr": 146.78,
    "indiaUsdMn": 762.89
  },
  {
    "name": "Other Miscellaenious Chemicals",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 16.15,
    "inrCr": 142.28,
    "indiaUsdMn": 2230.92
  },
  {
    "name": "Cocoa Products",
    "sector": "Cereal Preparations and Miscellaneous Processed Item",
    "usdMn": 14.56,
    "inrCr": 128.69,
    "indiaUsdMn": 317.93
  },
  {
    "name": "Coffee",
    "sector": "Coffee",
    "usdMn": 14.0,
    "inrCr": 125.42,
    "indiaUsdMn": 2082.7
  },
  {
    "name": "Medical and Scientific Instruments",
    "sector": "Engineering Goods",
    "usdMn": 13.6,
    "inrCr": 120.54,
    "indiaUsdMn": 2859.88
  },
  {
    "name": "Ayush and Herbal Products",
    "sector": "Drugs and Pharmaceuticals",
    "usdMn": 13.19,
    "inrCr": 116.0,
    "indiaUsdMn": 638.29
  },
  {
    "name": "Other Rubber Product Except Footwear",
    "sector": "Engineering Goods",
    "usdMn": 13.03,
    "inrCr": 115.26,
    "indiaUsdMn": 1870.6
  },
  {
    "name": "Groundnut",
    "sector": "Oil Seeds",
    "usdMn": 12.95,
    "inrCr": 114.67,
    "indiaUsdMn": 690.93
  },
  {
    "name": "Glass and Glassware",
    "sector": "Ceramic Products and Glassware",
    "usdMn": 11.99,
    "inrCr": 106.02,
    "indiaUsdMn": 1184.02
  },
  {
    "name": "Electronics Instruments",
    "sector": "Electronic Goods",
    "usdMn": 11.72,
    "inrCr": 103.53,
    "indiaUsdMn": 4903.03
  },
  {
    "name": "Two and Three Wheelers",
    "sector": "Engineering Goods",
    "usdMn": 11.39,
    "inrCr": 102.84,
    "indiaUsdMn": 3982.74
  },
  {
    "name": "Hand Tool, Cutting Tool of Metals",
    "sector": "Engineering Goods",
    "usdMn": 10.76,
    "inrCr": 94.93,
    "indiaUsdMn": 1022.36
  },
  {
    "name": "Optical Items (Including Lens Etc)",
    "sector": "Others",
    "usdMn": 10.65,
    "inrCr": 94.38,
    "indiaUsdMn": 799.13
  },
  {
    "name": "Machine Tools",
    "sector": "Engineering Goods",
    "usdMn": 9.3,
    "inrCr": 82.02,
    "indiaUsdMn": 897.57
  },
  {
    "name": "Automatic Thinning Machines, Injectng Molding Machinery etc",
    "sector": "Engineering Goods",
    "usdMn": 8.63,
    "inrCr": 76.3,
    "indiaUsdMn": 3116.48
  },
  {
    "name": "Coal, Coke and Briquettes etc",
    "sector": "Mica, Coal and other Ores, Minerals including Process",
    "usdMn": 8.36,
    "inrCr": 74.88,
    "indiaUsdMn": 215.05
  },
  {
    "name": "Other Non Ferrous Metal and Products",
    "sector": "Engineering Goods",
    "usdMn": 7.33,
    "inrCr": 64.79,
    "indiaUsdMn": 1046.06
  },
  {
    "name": "Plywood and Allied Products",
    "sector": "Others",
    "usdMn": 7.26,
    "inrCr": 64.11,
    "indiaUsdMn": 1243.26
  },
  {
    "name": "Fresh Vegetables",
    "sector": "Fruits and Vegetables",
    "usdMn": 6.18,
    "inrCr": 55.07,
    "indiaUsdMn": 846.84
  },
  {
    "name": "Stationery/Office, School Supply",
    "sector": "Plastic and Linoleum",
    "usdMn": 5.85,
    "inrCr": 51.99,
    "indiaUsdMn": 239.25
  },
  {
    "name": "Iron Ore",
    "sector": "Iron Ore",
    "usdMn": 5.68,
    "inrCr": 51.09,
    "indiaUsdMn": 1708.33
  },
  {
    "name": "Finished Leather",
    "sector": "Leather and Leather Manufactures",
    "usdMn": 5.27,
    "inrCr": 46.49,
    "indiaUsdMn": 397.63
  },
  {
    "name": "Processed Vegetables",
    "sector": "Fruits and Vegetables",
    "usdMn": 4.99,
    "inrCr": 44.08,
    "indiaUsdMn": 774.28
  },
  {
    "name": "Electrodes",
    "sector": "Electronic Goods",
    "usdMn": 4.94,
    "inrCr": 43.8,
    "indiaUsdMn": 94.81
  },
  {
    "name": "Paint, Varnish and Allied Products",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 4.62,
    "inrCr": 40.32,
    "indiaUsdMn": 971.35
  },
  {
    "name": "Agro Chemicals",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 4.51,
    "inrCr": 39.87,
    "indiaUsdMn": 3871.29
  },
  {
    "name": "Cranes, Lifts and Winches",
    "sector": "Engineering Goods",
    "usdMn": 3.74,
    "inrCr": 32.89,
    "indiaUsdMn": 1072.61
  },
  {
    "name": "Gold and other Precious Metal Jewellery",
    "sector": "Gems and Jewellery",
    "usdMn": 3.72,
    "inrCr": 32.44,
    "indiaUsdMn": 13340.82
  },
  {
    "name": "Telecom Instruments",
    "sector": "Electronic Goods",
    "usdMn": 3.7,
    "inrCr": 32.71,
    "indiaUsdMn": 34226.24
  },
  {
    "name": "Tobacco Manufactured",
    "sector": "Tobacco",
    "usdMn": 3.7,
    "inrCr": 32.63,
    "indiaUsdMn": 581.69
  },
  {
    "name": "Nickel, Product made of Nickel",
    "sector": "Engineering Goods",
    "usdMn": 3.43,
    "inrCr": 29.66,
    "indiaUsdMn": 188.65
  },
  {
    "name": "Wollen Yarn, Fabrics, Madeups, etc",
    "sector": "Others",
    "usdMn": 2.83,
    "inrCr": 25.06,
    "indiaUsdMn": 176.28
  },
  {
    "name": "Petroleum Products",
    "sector": "Petroleum Products",
    "usdMn": 2.78,
    "inrCr": 24.54,
    "indiaUsdMn": 53828.39
  },
  {
    "name": "Essential Oils",
    "sector": "Organic and Inorganic Chemicals",
    "usdMn": 2.56,
    "inrCr": 22.52,
    "indiaUsdMn": 335.64
  },
  {
    "name": "Other Plastic Items",
    "sector": "Plastic and Linoleum",
    "usdMn": 2.53,
    "inrCr": 22.5,
    "indiaUsdMn": 552.79
  },
  {
    "name": "Sports Goods",
    "sector": "Others",
    "usdMn": 2.42,
    "inrCr": 21.46,
    "indiaUsdMn": 398.6
  },
  {
    "name": "Fruits / Vegetable Seeds",
    "sector": "Others",
    "usdMn": 2.42,
    "inrCr": 21.55,
    "indiaUsdMn": 165.71
  },
  {
    "name": "Processed Fruits and Juices",
    "sector": "Fruits and Vegetables",
    "usdMn": 2.25,
    "inrCr": 19.84,
    "indiaUsdMn": 985.94
  },
  {
    "name": "Processed Minerals",
    "sector": "Mica, Coal and other Ores, Minerals including Process",
    "usdMn": 2.25,
    "inrCr": 19.95,
    "indiaUsdMn": 2299.95
  },
  {
    "name": "Railway Transport Equipments, Parts",
    "sector": "Engineering Goods",
    "usdMn": 2.13,
    "inrCr": 18.68,
    "indiaUsdMn": 504.11
  },
  {
    "name": "RMG Man-made Fibres",
    "sector": "RMG of All Textiles",
    "usdMn": 1.95,
    "inrCr": 17.33,
    "indiaUsdMn": 2592.83
  },
  {
    "name": "Computer Hardware, Peripherals",
    "sector": "Electronic Goods",
    "usdMn": 1.71,
    "inrCr": 15.26,
    "indiaUsdMn": 1759.67
  },
  {
    "name": "Nuclear Reactor, Industrial Boiler, Parts",
    "sector": "Engineering Goods",
    "usdMn": 1.61,
    "inrCr": 14.37,
    "indiaUsdMn": 1036.47
  },
  {
    "name": "Books, Publications and Printing",
    "sector": "Others",
    "usdMn": 1.59,
    "inrCr": 14.0,
    "indiaUsdMn": 455.8
  },
  {
    "name": "Vegetable Oils",
    "sector": "Others",
    "usdMn": 1.54,
    "inrCr": 13.76,
    "indiaUsdMn": 732.09
  },
  {
    "name": "Wheat",
    "sector": "Others",
    "usdMn": 1.53,
    "inrCr": 13.67,
    "indiaUsdMn": 10.29
  },
  {
    "name": "Tin and Products made of Tin",
    "sector": "Engineering Goods",
    "usdMn": 1.32,
    "inrCr": 11.56,
    "indiaUsdMn": 50.8
  },
  {
    "name": "Consumer Electronics",
    "sector": "Electronic Goods",
    "usdMn": 1.27,
    "inrCr": 11.33,
    "indiaUsdMn": 742.77
  },
  {
    "name": "Shellac",
    "sector": "Others",
    "usdMn": 1.08,
    "inrCr": 9.38,
    "indiaUsdMn": 87.72
  },
  {
    "name": "Pearl, Precious, Semiprecious Stones",
    "sector": "Gems and Jewellery",
    "usdMn": 1.04,
    "inrCr": 9.17,
    "indiaUsdMn": 14141.27
  },
  {
    "name": "Footwear of Leather",
    "sector": "Leather and Leather Manufactures",
    "usdMn": 1.01,
    "inrCr": 8.83,
    "indiaUsdMn": 1946.86
  },
  {
    "name": "Sugar",
    "sector": "Others",
    "usdMn": 0.77,
    "inrCr": 6.65,
    "indiaUsdMn": 2087.35
  },
  {
    "name": "Dyes",
    "sector": "Others",
    "usdMn": 0.69,
    "inrCr": 5.99,
    "indiaUsdMn": 2189.85
  },
  {
    "name": "Cement, Clinker and Asbestos Cement",
    "sector": "Others",
    "usdMn": 0.62,
    "inrCr": 5.47,
    "indiaUsdMn": 467.22
  },
  {
    "name": "Accumulators and Batteries",
    "sector": "Electronic Goods",
    "usdMn": 0.48,
    "inrCr": 4.34,
    "indiaUsdMn": 723.26
  },
  {
    "name": "Carpet (Excluding Silk) Handmade",
    "sector": "Carpet",
    "usdMn": 0.45,
    "inrCr": 3.92,
    "indiaUsdMn": 1404.5
  },
  {
    "name": "Footwear of Rubber/Canvas etc.",
    "sector": "Others",
    "usdMn": 0.34,
    "inrCr": 3.04,
    "indiaUsdMn": 261.97
  },
  {
    "name": "Handloom Products",
    "sector": "Cotton Yarn/Fabs./Madeups, Handloom Products etc.",
    "usdMn": 0.33,
    "inrCr": 2.84,
    "indiaUsdMn": 153.88
  },
  {
    "name": "Natural Rubber",
    "sector": "Others",
    "usdMn": 0.33,
    "inrCr": 3.05,
    "indiaUsdMn": 5.85
  },
  {
    "name": "Castor Oil",
    "sector": "Others",
    "usdMn": 0.33,
    "inrCr": 2.86,
    "indiaUsdMn": 1145.24
  },
  {
    "name": "Bicycle and Parts",
    "sector": "Engineering Goods",
    "usdMn": 0.32,
    "inrCr": 2.81,
    "indiaUsdMn": 477.07
  },
  {
    "name": "Tea",
    "sector": "Tea",
    "usdMn": 0.3,
    "inrCr": 2.69,
    "indiaUsdMn": 988.13
  },
  {
    "name": "Lead and Products made of Led",
    "sector": "Engineering Goods",
    "usdMn": 0.2,
    "inrCr": 1.77,
    "indiaUsdMn": 1268.68
  },
  {
    "name": "Other Meat",
    "sector": "Meat, Dairy and Poultry Products",
    "usdMn": 0.16,
    "inrCr": 1.43,
    "indiaUsdMn": 0.66
  },
  {
    "name": "Other Wood and Wood Products",
    "sector": "Others",
    "usdMn": 0.1,
    "inrCr": 0.93,
    "indiaUsdMn": 75.07
  },
  {
    "name": "Fertilezers Crude",
    "sector": "Others",
    "usdMn": 0.09,
    "inrCr": 0.82,
    "indiaUsdMn": 27.71
  },
  {
    "name": "Other Crude Minerals",
    "sector": "Mica, Coal and other Ores, Minerals including Process",
    "usdMn": 0.09,
    "inrCr": 0.83,
    "indiaUsdMn": 224.03
  },
  {
    "name": "Coir and Coir Manufactures",
    "sector": "Others",
    "usdMn": 0.07,
    "inrCr": 0.64,
    "indiaUsdMn": 692.6
  },
  {
    "name": "Fertilezers Manufactured",
    "sector": "Others",
    "usdMn": 0.07,
    "inrCr": 0.6,
    "indiaUsdMn": 128.77
  },
  {
    "name": "Leather Goods",
    "sector": "Leather and Leather Manufactures",
    "usdMn": 0.07,
    "inrCr": 0.65,
    "indiaUsdMn": 1253.6
  },
  {
    "name": "Processed Meat",
    "sector": "Meat, Dairy and Poultry Products",
    "usdMn": 0.06,
    "inrCr": 0.58,
    "indiaUsdMn": 1.72
  },
  {
    "name": "Guergam Meal",
    "sector": "Others",
    "usdMn": 0.03,
    "inrCr": 0.3,
    "indiaUsdMn": 550.13
  },
  {
    "name": "Natural Silk Yarn, Fabrics, Madeup",
    "sector": "Others",
    "usdMn": 0.03,
    "inrCr": 0.28,
    "indiaUsdMn": 221.22
  },
  {
    "name": "Aircraft, Spacecraft and Parts",
    "sector": "Engineering Goods",
    "usdMn": 0.03,
    "inrCr": 0.29,
    "indiaUsdMn": 1665.54
  },
  {
    "name": "Prime Mica and Mica Products",
    "sector": "Engineering Goods",
    "usdMn": 0.02,
    "inrCr": 0.22,
    "indiaUsdMn": 29.76
  },
  {
    "name": "Floor Covering of Jute",
    "sector": "Jute Mfg. including Floor Covering",
    "usdMn": 0.02,
    "inrCr": 0.17,
    "indiaUsdMn": 76.32
  },
  {
    "name": "Marine Products",
    "sector": "Marine Products",
    "usdMn": 0.01,
    "inrCr": 0.13,
    "indiaUsdMn": 8431.33
  },
  {
    "name": "Jute Hessian",
    "sector": "Jute Mfg. including Floor Covering",
    "usdMn": 0.01,
    "inrCr": 0.1,
    "indiaUsdMn": 112.46
  },
  {
    "name": "Niger Seeds",
    "sector": "Oil Seeds",
    "usdMn": 0.01,
    "inrCr": 0.07,
    "indiaUsdMn": 10.35
  },
  {
    "name": "Saddlery and Harness",
    "sector": "Others",
    "usdMn": 0.01,
    "inrCr": 0.07,
    "indiaUsdMn": 220.38
  },
  {
    "name": "Office Equipments",
    "sector": "Engineering Goods",
    "usdMn": 0.01,
    "inrCr": 0.09,
    "indiaUsdMn": 394.76
  },
  {
    "name": "Human Hair, Products Thereof",
    "sector": "Others",
    "usdMn": 0.01,
    "inrCr": 0.06,
    "indiaUsdMn": 942.83
  },
  {
    "name": "Project Goods",
    "sector": "Engineering Goods",
    "usdMn": 0.0,
    "inrCr": 0.04,
    "indiaUsdMn": 1.78
  },
  {
    "name": "Silk Carpet",
    "sector": "Carpet",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 54.72
  },
  {
    "name": "Animal Casings",
    "sector": "Meat, Dairy and Poultry Products",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 58.91
  },
  {
    "name": "Sheep/Goat Meat",
    "sector": "Meat, Dairy and Poultry Products",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 103.57
  },
  {
    "name": "Wool, Raw",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 0.67
  },
  {
    "name": "Newsprint",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 4.25
  },
  {
    "name": "Pulp and Waste Paper",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 0.93
  },
  {
    "name": "Zinc and Products made of Zinc",
    "sector": "Engineering Goods",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 878.72
  },
  {
    "name": "Mica",
    "sector": "Mica, Coal and other Ores, Minerals including Process",
    "usdMn": 0.0,
    "inrCr": 0.03,
    "indiaUsdMn": 57.92
  },
  {
    "name": "RMG Wool",
    "sector": "RMG of All Textiles",
    "usdMn": 0.0,
    "inrCr": 0.03,
    "indiaUsdMn": 183.84
  },
  {
    "name": "Leather Footwear Component",
    "sector": "Leather and Leather Manufactures",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 253.38
  },
  {
    "name": "Cashew Nut Shell Liquid",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 26.76
  },
  {
    "name": "Gold",
    "sector": "Gems and Jewellery",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 245.54
  },
  {
    "name": "Other Jute Manufactures",
    "sector": "Jute Mfg. including Floor Covering",
    "usdMn": 0.0,
    "inrCr": 0.04,
    "indiaUsdMn": 151.33
  },
  {
    "name": "Tobacco Unmanufactured",
    "sector": "Tobacco",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 1367.28
  },
  {
    "name": "Dye Intermediates",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 188.51
  },
  {
    "name": "Poultry Products",
    "sector": "Meat, Dairy and Poultry Products",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 317.8
  },
  {
    "name": "Cashew",
    "sector": "Cashew",
    "usdMn": 0.0,
    "inrCr": 0.01,
    "indiaUsdMn": 378.58
  },
  {
    "name": "Ship, Boat and Floating Structures",
    "sector": "Engineering Goods",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 4110.69
  },
  {
    "name": "Leather Garments",
    "sector": "Leather and Leather Manufactures",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 416.29
  },
  {
    "name": "Floriculture Products",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.01,
    "indiaUsdMn": 92.55
  },
  {
    "name": "Raw Hides and Skins",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 1.45
  },
  {
    "name": "Other Precious and Base Metals",
    "sector": "Gems and Jewellery",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 430.78
  },
  {
    "name": "Silver",
    "sector": "Gems and Jewellery",
    "usdMn": 0.0,
    "inrCr": 0.01,
    "indiaUsdMn": 49.69
  },
  {
    "name": "Silk, Raw",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 0.25
  },
  {
    "name": "Jute, Raw",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 25.22
  },
  {
    "name": "Sulphur, Unroasted Iron Pyrite",
    "sector": "Mica, Coal and other Ores, Minerals including Process",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 329.59
  },
  {
    "name": "Petroleum: Crude",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 0.0
  },
  {
    "name": "Jute Yarn",
    "sector": "Jute Mfg. including Floor Covering",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 17.5
  },
  {
    "name": "Mollases",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 7.26
  },
  {
    "name": "RMG Silk",
    "sector": "RMG of All Textiles",
    "usdMn": 0.0,
    "inrCr": 0.01,
    "indiaUsdMn": 77.25
  },
  {
    "name": "Buffalo Meat",
    "sector": "Meat, Dairy and Poultry Products",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 5098.54
  },
  {
    "name": "Silk Waste",
    "sector": "Others",
    "usdMn": 0.0,
    "inrCr": 0.0,
    "indiaUsdMn": 34.82
  }
];

/** MP month-wise exports, FY 2025-26 (all principal commodities). */
export const mpMonthly: MpMonthlyExport[] = [
  {
    "month": "Apr",
    "year": 2025,
    "usdMn": 677.92,
    "inrCr": 5800.33
  },
  {
    "month": "May",
    "year": 2025,
    "usdMn": 626.29,
    "inrCr": 5335.32
  },
  {
    "month": "Jun",
    "year": 2025,
    "usdMn": 617.08,
    "inrCr": 5300.94
  },
  {
    "month": "Jul",
    "year": 2025,
    "usdMn": 638.07,
    "inrCr": 5494.67
  },
  {
    "month": "Aug",
    "year": 2025,
    "usdMn": 627.65,
    "inrCr": 5493.08
  },
  {
    "month": "Sep",
    "year": 2025,
    "usdMn": 666.95,
    "inrCr": 5890.64
  },
  {
    "month": "Oct",
    "year": 2025,
    "usdMn": 585.79,
    "inrCr": 5179.32
  },
  {
    "month": "Nov",
    "year": 2025,
    "usdMn": 665.24,
    "inrCr": 5909.07
  },
  {
    "month": "Dec",
    "year": 2025,
    "usdMn": 734.06,
    "inrCr": 6613.25
  },
  {
    "month": "Jan",
    "year": 2026,
    "usdMn": 664.73,
    "inrCr": 6035.7
  },
  {
    "month": "Feb",
    "year": 2026,
    "usdMn": 597.13,
    "inrCr": 5417.83
  },
  {
    "month": "Mar",
    "year": 2026,
    "usdMn": 676.58,
    "inrCr": 6275.98
  }
];

/** State-wise exports and share of India's exports. */
export const stateExports: StateExport[] = [
  {
    "state": "Gujarat",
    "usdMn2025": 111414.6,
    "usdMn2026Ytd": 64591.88,
    "share2026": 27.18
  },
  {
    "state": "Maharashtra",
    "usdMn2025": 69365.36,
    "usdMn2026Ytd": 36661.93,
    "share2026": 15.43
  },
  {
    "state": "Tamil Nadu",
    "usdMn2025": 59256.33,
    "usdMn2026Ytd": 32002.11,
    "share2026": 13.46
  },
  {
    "state": "Karnataka",
    "usdMn2025": 35146.55,
    "usdMn2026Ytd": 18313.84,
    "share2026": 7.71
  },
  {
    "state": "Uttar Pradesh",
    "usdMn2025": 23110.79,
    "usdMn2026Ytd": 12008.5,
    "share2026": 5.05
  },
  {
    "state": "Haryana",
    "usdMn2025": 20321.18,
    "usdMn2026Ytd": 10815.96,
    "share2026": 4.55
  },
  {
    "state": "Andhra Pradesh",
    "usdMn2025": 20228.24,
    "usdMn2026Ytd": 9941.92,
    "share2026": 4.18
  },
  {
    "state": "Telangana",
    "usdMn2025": 15117.63,
    "usdMn2026Ytd": 7195.02,
    "share2026": 3.03
  },
  {
    "state": "West Bengal",
    "usdMn2025": 13112.88,
    "usdMn2026Ytd": 7037.85,
    "share2026": 2.96
  },
  {
    "state": "Odisha",
    "usdMn2025": 10373.38,
    "usdMn2026Ytd": 6420.72,
    "share2026": 2.7
  },
  {
    "state": "Rajasthan",
    "usdMn2025": 11675.07,
    "usdMn2026Ytd": 5646.5,
    "share2026": 2.38
  },
  {
    "state": "Delhi",
    "usdMn2025": 10876.51,
    "usdMn2026Ytd": 5528.66,
    "share2026": 2.33
  },
  {
    "state": "Madhya Pradesh",
    "usdMn2025": 7922.25,
    "usdMn2026Ytd": 4016.02,
    "share2026": 1.69
  },
  {
    "state": "Punjab",
    "usdMn2025": 7266.93,
    "usdMn2026Ytd": 3650.96,
    "share2026": 1.54
  },
  {
    "state": "Dadra & Nagar Haveli and Daman & Diu",
    "usdMn2025": 4804.92,
    "usdMn2026Ytd": 2630.74,
    "share2026": 1.11
  },
  {
    "state": "Kerala",
    "usdMn2025": 5244.55,
    "usdMn2026Ytd": 2381.45,
    "share2026": 1.0
  },
  {
    "state": "Goa",
    "usdMn2025": 2765.94,
    "usdMn2026Ytd": 1500.37,
    "share2026": 0.63
  },
  {
    "state": "Himachal Pradesh",
    "usdMn2025": 2474.9,
    "usdMn2026Ytd": 1422.04,
    "share2026": 0.6
  },
  {
    "state": "Bihar",
    "usdMn2025": 2118.85,
    "usdMn2026Ytd": 1372.33,
    "share2026": 0.58
  },
  {
    "state": "Jharkhand",
    "usdMn2025": 2216.09,
    "usdMn2026Ytd": 1304.52,
    "share2026": 0.55
  },
  {
    "state": "Chhattisgarh",
    "usdMn2025": 2139.24,
    "usdMn2026Ytd": 1271.13,
    "share2026": 0.53
  },
  {
    "state": "Uttarakhand",
    "usdMn2025": 1580.19,
    "usdMn2026Ytd": 1025.96,
    "share2026": 0.43
  },
  {
    "state": "Puducherry",
    "usdMn2025": 550.7,
    "usdMn2026Ytd": 306.09,
    "share2026": 0.13
  },
  {
    "state": "Assam",
    "usdMn2025": 601.74,
    "usdMn2026Ytd": 291.68,
    "share2026": 0.12
  },
  {
    "state": "Jammu and Kashmir",
    "usdMn2025": 291.3,
    "usdMn2026Ytd": 168.01,
    "share2026": 0.07
  },
  {
    "state": "Meghalaya",
    "usdMn2025": 97.98,
    "usdMn2026Ytd": 81.73,
    "share2026": 0.03
  },
  {
    "state": "Chandigarh",
    "usdMn2025": 127.19,
    "usdMn2026Ytd": 59.69,
    "share2026": 0.03
  },
  {
    "state": "Sikkim",
    "usdMn2025": 23.03,
    "usdMn2026Ytd": 10.53,
    "share2026": 0.0
  },
  {
    "state": "Tripura",
    "usdMn2025": 6.24,
    "usdMn2026Ytd": 9.41,
    "share2026": 0.0
  },
  {
    "state": "Nagaland",
    "usdMn2025": 0.83,
    "usdMn2026Ytd": 3.33,
    "share2026": 0.0
  },
  {
    "state": "Manipur",
    "usdMn2025": 1.76,
    "usdMn2026Ytd": 1.39,
    "share2026": 0.0
  },
  {
    "state": "Mizoram",
    "usdMn2025": 1.29,
    "usdMn2026Ytd": 0.61,
    "share2026": 0.0
  },
  {
    "state": "Arunachal Pradesh",
    "usdMn2025": 0.72,
    "usdMn2026Ytd": 0.48,
    "share2026": 0.0
  },
  {
    "state": "Andaman and Nicobar Islands",
    "usdMn2025": 0.93,
    "usdMn2026Ytd": 0.25,
    "share2026": 0.0
  },
  {
    "state": "Ladakh",
    "usdMn2025": 0.13,
    "usdMn2026Ytd": 0.18,
    "share2026": 0.0
  },
  {
    "state": "Lakshadweep",
    "usdMn2025": 0.0,
    "usdMn2026Ytd": 0.0,
    "share2026": 0.0
  }
];
