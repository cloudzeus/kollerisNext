import * as XLSX from 'xlsx';

export default async function createCSVfile(data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "data");
  const date = new Date().toISOString().slice(0, 10);
  const buf = XLSX.write(workbook, { type:"buffer", bookType:"xlsx" });
  return buf;

};