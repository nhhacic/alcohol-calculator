// Lấy form và các elements
const form = document.getElementById('alcoholForm');
const resultDiv = document.getElementById('result');
const btnChangeInfo = document.getElementById('btnChangeInfo');
const btnRetry = document.getElementById('btnRetry');

// Elements để hiển thị kết quả
const summaryGender = document.getElementById('summaryGender');
const summaryWeight = document.getElementById('summaryWeight');
const summaryDrink = document.getElementById('summaryDrink');
const summaryVehicle = document.getElementById('summaryVehicle');
const bacMgPer100ml = document.getElementById('bacMgPer100ml');
const bacMgPerLiter = document.getElementById('bacMgPerLiter');
const timeToZero = document.getElementById('timeToZero');
const fineAmount = document.getElementById('fineAmount');
const licensePoints = document.getElementById('licensePoints');

// Elements cho form
const drinkAmountInput = document.getElementById('drinkAmount');
const unitHint = document.getElementById('unitHint');
const inputUnit = document.getElementById('inputUnit');
const drinkTypeRadios = document.querySelectorAll('input[name="drinkType"]');
const vehicleRadios = document.querySelectorAll('input[name="vehicle"]');

// Thông tin các loại đồ uống
const drinkTypes = {
    beer: {
        name: 'Bia',
        alcoholPercent: 5,
        volumePerUnit: 330, // ml mỗi lon
        unit: 'lon',
        unitName: 'lon bia'
    },
    strong: {
        name: 'Chén rượu',
        alcoholPercent: 40,
        volumePerUnit: 30, // ml mỗi chén
        unit: 'chén',
        unitName: 'chén rượu'
    },
    wine: {
        name: 'Ly vang',
        alcoholPercent: 13.5,
        volumePerUnit: 100, // ml mỗi ly
        unit: 'ly',
        unitName: 'ly vang'
    }
};

// Hàm cập nhật đơn vị và thông tin khi chọn loại đồ uống
function updateDrinkInfo(selectedType) {
    if (selectedType && drinkTypes[selectedType]) {
        const drink = drinkTypes[selectedType];
        inputUnit.textContent = drink.unitName;
        drinkAmountInput.placeholder = `Nhập số ${drink.unit}`;
        // Hiển thị thông tin chi tiết
        unitHint.textContent = `1 ${drink.unitName} có thể tích: ${drink.volumePerUnit}ml, độ cồn: ${drink.alcoholPercent}°`;
    }
}

// Cập nhật đơn vị và thông tin khi chọn loại đồ uống
drinkTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        updateDrinkInfo(this.value);
    });
});

// Khởi tạo đơn vị mặc định khi trang load (nếu Bia được chọn)
function initDefaultDrinkInfo() {
    const defaultDrinkType = document.querySelector('input[name="drinkType"]:checked');
    if (defaultDrinkType) {
        updateDrinkInfo(defaultDrinkType.value);
    }
}

// Chạy ngay khi script load và khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDefaultDrinkInfo);
} else {
    // DOM đã sẵn sàng
    initDefaultDrinkInfo();
}

// Hàm tính nồng độ cồn trong máu (BAC - Blood Alcohol Content)
// Công thức Widmark: BAC = (A × 5.14) / (W × r)
// Trong đó:
// A = lượng cồn tiêu thụ (gram)
// W = cân nặng (pound)
// r = hệ số phân phối (0.68 cho nam, 0.55 cho nữ)

// Hàm tính lượng cồn từ loại đồ uống và số lượng
function calculateTotalAlcohol(drinkType, amount) {
    if (!drinkTypes[drinkType] || amount <= 0) return 0;
    
    const drink = drinkTypes[drinkType];
    // Tính tổng thể tích (ml)
    const totalVolume = amount * drink.volumePerUnit;
    
    // Tính lượng cồn (gram)
    // Công thức: thể tích (ml) × độ cồn (%) × tỷ trọng cồn (0.789 g/ml) / 100
    const alcoholDensity = 0.789; // g/ml
    const totalAlcohol = (totalVolume * drink.alcoholPercent * alcoholDensity) / 100;
    
    return totalAlcohol;
}

function calculateBAC(gender, weightKg, drinkType, amount) {
    // Tính tổng lượng cồn (gram)
    const totalAlcohol = calculateTotalAlcohol(drinkType, amount);
    
    if (totalAlcohol <= 0) return 0;
    
    // Hệ số phân phối theo giới tính
    const r = gender === 'male' ? 0.68 : 0.55;
    
    // Chuyển cân nặng từ kg sang pound (1 kg = 2.20462 pound)
    const weightPounds = weightKg * 2.20462;
    
    // Tính BAC (giả sử uống ngay trước đó)
    // Công thức Widmark: BAC = (A × 5.14) / (W × r)
    const bac = (totalAlcohol * 5.14) / (weightPounds * r);
    
    return Math.max(0, bac); // Đảm bảo không âm
}

// Hàm tính thời gian hết cồn (giờ)
// Tốc độ đào thải cồn trung bình: 0.15 g/L/giờ (hoặc 15 mg/100ml/giờ)
// Công thức: Thời gian = BAC / Tốc độ đào thải
function calculateTimeToZero(bacGPerLiter) {
    if (bacGPerLiter <= 0) return 0;
    
    // Tốc độ đào thải: 0.15 g/L mỗi giờ (hoặc 15 mg/100ml/giờ)
    const eliminationRate = 0.15; // g/L per hour
    const timeHours = bacGPerLiter / eliminationRate;
    
    return Math.max(0, timeHours);
}

// Hàm tính mức phạt dựa trên BAC và phương tiện
// Theo Nghị định 168/2024/NĐ-CP (có hiệu lực từ 01/01/2025)
// Lưu ý: Pháp luật Việt Nam nghiêm cấm điều khiển phương tiện khi có nồng độ cồn
function calculatePenalty(bacMgPer100ml, vehicle) {
    // Nếu không có cồn
    if (bacMgPer100ml <= 0) {
        return {
            fine: 'Không phạt',
            points: '0 điểm'
        };
    }
    
    // Xe đạp/Xe thô sơ
    if (vehicle === 'bicycle') {
        if (bacMgPer100ml <= 50) {
            return {
                fine: '80.000 - 100.000 đồng',
                points: '0 điểm'
            };
        } else if (bacMgPer100ml > 50 && bacMgPer100ml <= 80) {
            return {
                fine: '200.000 - 300.000 đồng',
                points: '0 điểm'
            };
        } else {
            return {
                fine: '400.000 - 600.000 đồng',
                points: '0 điểm'
            };
        }
    }
    
    // Xe máy/Xe gắn máy
    if (vehicle === 'motorcycle') {
        if (bacMgPer100ml <= 50) {
            return {
                fine: '2 - 3 triệu đồng',
                points: '-04 điểm'
            };
        } else if (bacMgPer100ml > 50 && bacMgPer100ml <= 80) {
            return {
                fine: '6 - 8 triệu đồng',
                points: '-10 điểm'
            };
        } else {
            return {
                fine: '8 - 10 triệu đồng',
                points: 'Tước GPLX 22-24 tháng'
            };
        }
    }
    
    // Ô tô
    if (vehicle === 'car') {
        if (bacMgPer100ml <= 50) {
            return {
                fine: '6 - 8 triệu đồng',
                points: '-04 điểm'
            };
        } else if (bacMgPer100ml > 50 && bacMgPer100ml <= 80) {
            return {
                fine: '18 - 20 triệu đồng',
                points: '-10 điểm'
            };
        } else {
            return {
                fine: '30 - 40 triệu đồng',
                points: 'Tước GPLX 22-24 tháng'
            };
        }
    }
    
    // Mặc định
    return {
        fine: 'Cần kiểm tra',
        points: '-'
    };
}

// Hàm format số với dấu phẩy
function formatNumber(num) {
    return num.toFixed(1).replace('.', ',');
}

// Hàm hiển thị thông tin đầu vào
function displayInputSummary(gender, weight, drinkType, amount, vehicle) {
    summaryGender.textContent = gender === 'male' ? 'Nam' : 'Nữ';
    summaryWeight.textContent = `${formatNumber(weight)} kg`;
    
    // Hiển thị loại đồ uống và số lượng
    if (drinkTypes[drinkType]) {
        const drink = drinkTypes[drinkType];
        summaryDrink.textContent = `${formatNumber(amount)} ${drink.unitName}`;
    } else {
        summaryDrink.textContent = '-';
    }
    
    const vehicleNames = {
        'car': 'Ô tô',
        'motorcycle': 'Xe máy',
        'bicycle': 'Xe đạp'
    };
    summaryVehicle.textContent = vehicleNames[vehicle] || vehicle;
}

// Xử lý submit form
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Lấy giá trị từ form
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const weight = parseFloat(document.getElementById('weight').value);
    const drinkType = document.querySelector('input[name="drinkType"]:checked')?.value;
    const amount = parseFloat(document.getElementById('drinkAmount').value);
    const vehicle = document.querySelector('input[name="vehicle"]:checked')?.value;
    
    // Kiểm tra validation
    if (!gender || !weight || !drinkType || isNaN(amount) || amount <= 0 || !vehicle) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Tính toán BAC (g/L)
    const bacGPerLiter = calculateBAC(gender, weight, drinkType, amount);
    
    // Chuyển đổi sang mg/100ml máu
    // 1 g/L = 1000 mg/L = 100 mg/100ml
    const bacMgPer100mlValue = bacGPerLiter * 100;
    
    // Chuyển đổi sang mg/lít khí thở
    // Tỷ lệ máu:khí thở khoảng 2100:1
    // 1 g/L máu ≈ 0.476 mg/L khí thở (1/2100 * 1000)
    const bacMgPerLiterBreath = bacGPerLiter * 0.476;
    
    // Tính thời gian hết cồn
    const timeHours = calculateTimeToZero(bacGPerLiter);
    
    // Tính mức phạt
    const penalty = calculatePenalty(bacMgPer100mlValue, vehicle);
    
    // Hiển thị thông tin đầu vào
    displayInputSummary(gender, weight, drinkType, amount, vehicle);
    
    // Hiển thị kết quả BAC
    bacMgPer100ml.textContent = formatNumber(bacMgPer100mlValue);
    bacMgPerLiter.textContent = formatNumber(bacMgPerLiterBreath);
    
    // Hiển thị thời gian hết cồn
    timeToZero.textContent = `${formatNumber(timeHours)} giờ`;
    
    // Hiển thị mức phạt
    fineAmount.textContent = penalty.fine;
    licensePoints.textContent = penalty.points;
    
    // Ẩn form và hiển thị kết quả
    form.style.display = 'none';
    resultDiv.classList.remove('hidden');
    
    // Scroll đến đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Xử lý nút "Thay đổi thông tin"
btnChangeInfo.addEventListener('click', function() {
    form.style.display = 'flex';
    resultDiv.classList.add('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Xử lý nút "Thử lại"
btnRetry.addEventListener('click', function() {
    form.reset();
    inputUnit.textContent = '-';
    unitHint.textContent = '';
    form.style.display = 'flex';
    resultDiv.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
