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
const statusCard = document.getElementById('statusCard');
const statusIcon = document.getElementById('statusIcon');
const statusValue = document.getElementById('statusValue');
const endTimeInput = document.getElementById('endTime');

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

// Hàm format thời gian thành dd/mm/yyyy hh:mm AM/PM cho input
function formatDateTimeForInput(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Chuyển đổi sang định dạng 12 giờ với AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Nếu là 0 thì chuyển thành 12
    const formattedHours = String(hours).padStart(2, '0');
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
}

// Hàm parse thời gian từ dd/mm/yyyy hh:mm AM/PM
function parseDateTimeInput(dateString) {
    if (!dateString) return null;
    
    // Format: dd/mm/yyyy hh:mm AM/PM
    const match = dateString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) (AM|PM)/);
    if (!match) return null;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    const year = parseInt(match[3], 10);
    let hours = parseInt(match[4], 10);
    const minutes = parseInt(match[5], 10);
    const ampm = match[6];
    
    // Chuyển đổi sang 24h format
    if (ampm === 'PM' && hours !== 12) {
        hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return new Date(year, month, day, hours, minutes);
}

// Hàm set giá trị mặc định cho thời gian kết thúc uống (ngày hiện tại trừ 1 ngày)
function setDefaultEndTime() {
    if (endTimeInput) {
        const now = new Date();
        // Trừ 1 ngày
        now.setDate(now.getDate() - 1);
        
        // Format thành dd/mm/yyyy hh:mm AM/PM
        endTimeInput.value = formatDateTimeForInput(now);
    }
}

// Thêm input mask cho thời gian để tự động format
if (endTimeInput) {
    endTimeInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Chỉ lấy số
        
        if (value.length > 0) {
            // Format: dd/mm/yyyy hh:mm AM/PM
            let formatted = '';
            
            // Ngày (2 chữ số)
            if (value.length > 0) formatted += value.substring(0, 2);
            if (value.length > 2) formatted += '/' + value.substring(2, 4);
            if (value.length > 4) formatted += '/' + value.substring(4, 8);
            if (value.length > 8) formatted += ' ' + value.substring(8, 10);
            if (value.length > 10) formatted += ':' + value.substring(10, 12);
            if (value.length > 12) {
                const hour = parseInt(value.substring(8, 10), 10);
                if (hour >= 12) {
                    formatted += ' PM';
                } else {
                    formatted += ' AM';
                }
            }
            
            e.target.value = formatted;
        }
    });
    
    // Validate format khi blur
    endTimeInput.addEventListener('blur', function(e) {
        const value = e.target.value;
        if (value && !value.match(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/)) {
            // Nếu không đúng format, thử parse và format lại
            const parsed = parseDateTimeInput(value);
            if (parsed) {
                e.target.value = formatDateTimeForInput(parsed);
            } else {
                // Nếu không parse được, clear hoặc giữ nguyên để user sửa
                e.target.style.borderColor = '#e74c3c';
            }
        } else {
            e.target.style.borderColor = '';
        }
    });
}

// Chạy ngay khi script load và khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initDefaultDrinkInfo();
        setDefaultEndTime();
    });
} else {
    // DOM đã sẵn sàng
    initDefaultDrinkInfo();
    setDefaultEndTime();
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

function calculateBAC(gender, weightKg, drinkType, amount, hoursElapsed = 0) {
    // Tính tổng lượng cồn (gram)
    const totalAlcohol = calculateTotalAlcohol(drinkType, amount);
    
    if (totalAlcohol <= 0) return 0;
    
    // Hệ số phân phối theo giới tính
    const r = gender === 'male' ? 0.68 : 0.55;
    
    // Chuyển cân nặng từ kg sang pound (1 kg = 2.20462 pound)
    const weightPounds = weightKg * 2.20462;
    
    // Tính BAC ban đầu (tại thời điểm uống xong)
    // Công thức Widmark: BAC = (A × 5.14) / (W × r)
    const initialBAC = (totalAlcohol * 5.14) / (weightPounds * r);
    
    // Tính BAC sau thời gian đã trôi qua
    // Tốc độ đào thải: 0.15 g/L mỗi giờ
    const eliminationRate = 0.15; // g/L per hour
    const bac = Math.max(0, initialBAC - (eliminationRate * hoursElapsed));
    
    return bac;
}

// Hàm tính thời gian hết cồn (giờ) từ BAC hiện tại
// Tốc độ đào thải cồn trung bình: 0.15 g/L/giờ (hoặc 15 mg/100ml/giờ)
// Công thức: Thời gian = BAC / Tốc độ đào thải
function calculateTimeToZero(bacGPerLiter) {
    if (bacGPerLiter <= 0) return 0;
    
    // Tốc độ đào thải: 0.15 g/L mỗi giờ (hoặc 15 mg/100ml/giờ)
    const eliminationRate = 0.15; // g/L per hour
    const timeHours = bacGPerLiter / eliminationRate;
    
    return Math.max(0, timeHours);
}

// Hàm tính số giờ đã trôi qua từ thời điểm kết thúc uống đến hiện tại
function calculateHoursElapsed(endTimeString) {
    if (!endTimeString) return 0;
    
    const endTime = parseDateTimeInput(endTimeString);
    if (!endTime) return 0;
    
    const now = new Date();
    const diffMs = now - endTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
}

// Hàm hiển thị trạng thái hiện tại
function displayCurrentStatus(bacMgPer100mlCurrent, hoursElapsed) {
    if (bacMgPer100mlCurrent <= 0) {
        statusIcon.textContent = '✅';
        statusCard.style.borderLeftColor = '#50c878';
        if (hoursElapsed > 0) {
            statusValue.textContent = `Đã hết cồn (sau ${formatNumber(hoursElapsed)} giờ)`;
        } else {
            statusValue.textContent = 'Chưa uống rượu bia';
        }
    } else {
        statusIcon.textContent = '⚠️';
        statusCard.style.borderLeftColor = '#ff6b35';
        const remainingHours = calculateTimeToZero(bacMgPer100mlCurrent / 100);
        statusValue.textContent = `Còn cồn: ${formatNumber(bacMgPer100mlCurrent)} mg/100ml (còn ${formatNumber(remainingHours)} giờ nữa)`;
    }
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

// Hàm format thời gian theo định dạng dd/mm/yyyy hh:mm AM/PM (cho hiển thị)
function formatDateTime(dateString) {
    if (!dateString) return '';
    
    // Nếu đã là định dạng dd/mm/yyyy hh:mm AM/PM thì trả về luôn
    if (dateString.match(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)/)) {
        return dateString;
    }
    
    // Nếu là Date object hoặc ISO string thì parse và format
    const date = dateString instanceof Date ? dateString : parseDateTimeInput(dateString) || new Date(dateString);
    return formatDateTimeForInput(date);
}

// Hàm hiển thị thông tin đầu vào
function displayInputSummary(gender, weight, drinkType, amount, vehicle, endTimeString) {
    summaryGender.textContent = gender === 'male' ? 'Nam' : 'Nữ';
    summaryWeight.textContent = `${formatNumber(weight)} kg`;
    
    // Hiển thị loại đồ uống và số lượng
    if (drinkTypes[drinkType]) {
        const drink = drinkTypes[drinkType];
        summaryDrink.textContent = `${formatNumber(amount)} ${drink.unitName}`;
        if (endTimeString) {
            summaryDrink.textContent += ` (${formatDateTime(endTimeString)})`;
        }
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
    const endTimeString = endTimeInput.value;
    
    // Kiểm tra validation
    if (!gender || !weight || !drinkType || isNaN(amount) || amount <= 0 || !vehicle) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Tính số giờ đã trôi qua từ khi kết thúc uống
    const hoursElapsed = calculateHoursElapsed(endTimeString);
    
    // Tính toán BAC ban đầu (tại thời điểm uống xong)
    const initialBAC = calculateBAC(gender, weight, drinkType, amount, 0);
    
    // Tính toán BAC hiện tại (tại thời điểm hiện tại)
    const currentBAC = calculateBAC(gender, weight, drinkType, amount, hoursElapsed);
    
    // Chuyển đổi sang mg/100ml máu
    const initialBACMgPer100ml = initialBAC * 100;
    const currentBACMgPer100ml = currentBAC * 100;
    
    // Chuyển đổi sang mg/lít khí thở
    const currentBACMgPerLiterBreath = currentBAC * 0.476;
    
    // Tính thời gian còn lại để hết cồn (từ thời điểm hiện tại)
    const remainingHours = calculateTimeToZero(currentBAC);
    
    // Tính mức phạt dựa trên BAC hiện tại
    const penalty = calculatePenalty(currentBACMgPer100ml, vehicle);
    
    // Hiển thị thông tin đầu vào
    displayInputSummary(gender, weight, drinkType, amount, vehicle, endTimeString);
    
    // Hiển thị kết quả BAC hiện tại
    bacMgPer100ml.textContent = formatNumber(currentBACMgPer100ml);
    bacMgPerLiter.textContent = formatNumber(currentBACMgPerLiterBreath);
    
    // Hiển thị trạng thái hiện tại
    displayCurrentStatus(currentBACMgPer100ml, hoursElapsed);
    
    // Hiển thị thời gian còn lại để hết cồn
    if (currentBACMgPer100ml > 0) {
        timeToZero.textContent = `${formatNumber(remainingHours)} giờ`;
    } else {
        timeToZero.textContent = 'Đã hết cồn';
    }
    
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
