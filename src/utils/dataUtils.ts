import * as XLSX from 'xlsx';

export const STORAGE_KEY = 'warehouse_dashboard_data';

export interface DashboardData {
    stats: any[];
    gpAnalysis: any[];
    inventoryStatus: any[];
    topProducts: any[];
    categoryPerformance: any[];
    salesTrend: any[];
}

export const saveToStorage = (data: DashboardData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromStorage = (): DashboardData | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

export const parseExcel = (file: File): Promise<{ [sheetName: string]: any[] }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const result: { [sheetName: string]: any[] } = {};

                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
                });

                resolve(result);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

export const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows = lines.slice(1).filter(line => line.trim() !== '').map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, i) => {
            obj[header] = values[i];
        });
        return obj;
    });
    return { headers, rows };
};
