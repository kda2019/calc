let EXTRA_CHARGE = 80
let EXTRA_CHARGE_CA = 120
let EUR_USD = 1.13
let CURRENT_YEAR = 2022

let url = 'https://sheets.googleapis.com/v4/spreadsheets/1TvtiRxP_dZYqb1I4xY4hik0hVw0YPmi7ibBxVo1y8oE/values/A1:K500?key=AIzaSyDKc47tmc8VRnfP_Trfl0fRwpZuJEB0C2c'

$.getJSON(url, function (r) {
    let tags = ['<option>Выберите аукцион</option>']
    let data = r.values.slice(1)
    data.forEach((i) => {
        if (i.length === 1) {
            tags.push(`<optgroup label="${i.pop()}">`)
        } else {
            if (i.length === 7) {
                i.push('', '', '', '')
            } else if (i.length === 8) {
                i.push('', '', '')
            } else if (i.length === 9) {
                i.push('', '')
            } else if (i.length === 10) {
                i.push('')
            }
            if ((i[1] === 'Copart' || i[1] === 'IAAI') && !(i[4].startsWith('Нет такой лакации'))) {
                let str = `<option value="${+i[6].split('-')[1]}&${+i[7].split('-')[1]}&${+i[8].split('-')[1]}&${+i[9].split('-')[1]}&${+i[10].split('-')[1]}&${i[1]}">${i[4]} - ${i[1]}</option>`
                tags.push(str)
            }
        }
    })

    let $places = $('#places')
    $places.html(tags)
    $places.select2({
        searchInputPlaceholder: "Поиск"
    })
    $places.on('change', (e) => {
        $('#delivery-price').html('0')
        let tags = ['<option>Выберите порт отправки</option>']
        let option_data = $places.val().split('&')
        if (option_data.length === 6) {
            if (option_data[0] !== 'NaN') {
                tags.push(`<option value='${option_data[0]}' data-port="New Jersey">New Jersey</option>`)
            }
            if (option_data[1] !== 'NaN') {
                tags.push(`<option value='${option_data[1]}' data-port="Savannah">Savannah</option>`)
            }
            if (option_data[2] !== 'NaN') {
                tags.push(`<option value='${option_data[2]}' data-port="Houston">Houston</option>`)
            }
            if (option_data[3] !== 'NaN') {
                tags.push(`<option value='${option_data[3]}' data-port="Los Angeles">Los Angeles</option>`)
            }
            // Закомментировано, пока Балтимор не добавлен
            // if (option_data[4] !== 'NaN') {
            //     tags.push(`<option value='${option_data[4]}' data-port="Baltimore">Baltimore</option>`)
            //}
        }
        let $ports = $('#ports')
        $ports.html(tags)
        $ports.off('change').on('change', (e) => {
            let port = $('#ports option:selected').attr('data-port')
            let ocean_shipping = 0
            if (port === 'New Jersey') {
                ocean_shipping += 600 + 25
            } else if (port === 'Savannah') {
                ocean_shipping += 575 + 50
            } else if (port === 'Houston') {
                ocean_shipping += 650 + 50
            } else if (port === 'Los Angeles') {
                ocean_shipping += 950 + 175
            } else if (port === 'Baltimore') {
                ocean_shipping += 700
            }

            $ports.attr('data-shipping', ocean_shipping)

            let delivery_price
            let $car_type = $('#car-type').val()
            if ($car_type === "Седан" || $car_type === "Кроссовер") {
                delivery_price = +ocean_shipping + +$ports.val()
            } else if ($car_type === "Пикап") {
                if (port === 'Los Angeles') {
                    delivery_price = (+ocean_shipping + 200) + +$ports.val()
                } else {
                    delivery_price = (+ocean_shipping * 2) + +$ports.val()
                }
            } else {
                delivery_price = 0
            }
            if (isNaN(delivery_price)) {
                delivery_price = 0
            } else if (delivery_price > 0) {
                delivery_price += EXTRA_CHARGE
            }
            $('#delivery-price').html(delivery_price)
        })
    })
    $('#car-type').on('change', (e) => {

        let $ports = $('#ports')
        let port = $('#ports option:selected').attr('data-port')
        let ocean_shipping = $ports.attr('data-shipping')
        let delivery_price
        let $car_type = $('#car-type').val()
        if ($car_type === "Седан" || $car_type === "Кроссовер") {
            delivery_price = +ocean_shipping + +$ports.val()
        } else if ($car_type === "Пикап") {
            if (port === 'Los Angeles') {
                delivery_price = (+ocean_shipping + 200) + +$ports.val()
            } else {
                delivery_price = (+ocean_shipping * 2) + +$ports.val()
            }
        } else {
            delivery_price = 0
        }
        if (isNaN(delivery_price)) {
            delivery_price = 0
        } else if (delivery_price > 0) {
            delivery_price += EXTRA_CHARGE
        }
        $('#delivery-price').html(delivery_price)
    })
})

$calc_cost = $("#calc-cost")
$calc_auction = $("#calc-auction")
$calc_category = $("#calc-category")
let end_cost = null
$("#calc-cost, #calc-auction, #calc-category").on('change', (event) => {
        if ($calc_cost.val() !== '') {
            if ($calc_auction.val() === 'copart') {
                if ($calc_category.val() === 'a') {
                    if (+$calc_cost.val() < 100) {
                        end_cost = 60
                    } else if (+$calc_cost.val() < 200) {
                        end_cost = 113
                    } else if (+$calc_cost.val() < 300) {
                        end_cost = 138
                    } else if (+$calc_cost.val() < 400) {
                        end_cost = 163
                    } else if (+$calc_cost.val() < 500) {
                        end_cost = 198
                    } else if (+$calc_cost.val() < 550) {
                        end_cost = 223
                    } else if (+$calc_cost.val() < 600) {
                        end_cost = 228
                    } else if (+$calc_cost.val() < 700) {
                        end_cost = 238
                    } else if (+$calc_cost.val() < 800) {
                        end_cost = 253
                    } else if (+$calc_cost.val() < 900) {
                        end_cost = 268
                    } else if (+$calc_cost.val() < 1000) {
                        end_cost = 283
                    } else if (+$calc_cost.val() < 1200) {
                        end_cost = 318
                    } else if (+$calc_cost.val() < 1300) {
                        end_cost = 343
                    } else if (+$calc_cost.val() < 1400) {
                        end_cost = 358
                    } else if (+$calc_cost.val() < 1500) {
                        end_cost = 368
                    } else if (+$calc_cost.val() < 1600) {
                        end_cost = 388
                    } else if (+$calc_cost.val() < 1700) {
                        end_cost = 403
                    } else if (+$calc_cost.val() < 1800) {
                        end_cost = 413
                    } else if (+$calc_cost.val() < 2000) {
                        end_cost = 428
                    } else if (+$calc_cost.val() < 2400) {
                        end_cost = 463
                    } else if (+$calc_cost.val() < 2500) {
                        end_cost = 473
                    } else if (+$calc_cost.val() < 3000) {
                        end_cost = 488
                    } else if (+$calc_cost.val() < 3500) {
                        end_cost = 538
                    } else if (+$calc_cost.val() < 4000) {
                        end_cost = 588
                    } else if (+$calc_cost.val() < 4500) {
                        end_cost = 723
                    } else if (+$calc_cost.val() < 5000) {
                        end_cost = 748
                    } else if (+$calc_cost.val() < 6000) {
                        end_cost = 773
                    } else if (+$calc_cost.val() < 7500) {
                        end_cost = 808
                    } else if (+$calc_cost.val() < 10000) {
                        end_cost = 833
                    } else if (+$calc_cost.val() < 15000) {
                        end_cost = 878
                    } else if (+$calc_cost.val() >= 15000) {
                        end_cost = ((+$calc_cost.val() * 0.055) + 119 + 59)
                    }
                } else if ($calc_category.val() === 'c') {
                    if (+$calc_cost.val() < 100) {
                        end_cost = 104
                    } else if (+$calc_cost.val() < 200) {
                        end_cost = 168
                    } else if (+$calc_cost.val() < 300) {
                        end_cost = 208
                    } else if (+$calc_cost.val() < 400) {
                        end_cost = 208
                    } else if (+$calc_cost.val() < 500) {
                        end_cost = 248
                    } else if (+$calc_cost.val() < 550) {
                        end_cost = 283
                    } else if (+$calc_cost.val() < 600) {
                        end_cost = 283
                    } else if (+$calc_cost.val() < 700) {
                        end_cost = 308
                    } else if (+$calc_cost.val() < 800) {
                        end_cost = 328
                    } else if (+$calc_cost.val() < 900) {
                        end_cost = 348
                    } else if (+$calc_cost.val() < 1000) {
                        end_cost = 373
                    } else if (+$calc_cost.val() < 1200) {
                        end_cost = 443
                    } else if (+$calc_cost.val() < 1300) {
                        end_cost = 468
                    } else if (+$calc_cost.val() < 1400) {
                        end_cost = 483
                    } else if (+$calc_cost.val() < 1500) {
                        end_cost = 498
                    } else if (+$calc_cost.val() < 1600) {
                        end_cost = 518
                    } else if (+$calc_cost.val() < 1700) {
                        end_cost = 538
                    } else if (+$calc_cost.val() < 1800) {
                        end_cost = 548
                    } else if (+$calc_cost.val() < 2000) {
                        end_cost = 568
                    } else if (+$calc_cost.val() < 2400) {
                        end_cost = 608
                    } else if (+$calc_cost.val() < 2500) {
                        end_cost = 618
                    } else if (+$calc_cost.val() < 3000) {
                        end_cost = 638
                    } else if (+$calc_cost.val() < 3500) {
                        end_cost = 738
                    } else if (+$calc_cost.val() < 4000) {
                        end_cost = 788
                    } else if (+$calc_cost.val() < 4500) {
                        end_cost = 823
                    } else if (+$calc_cost.val() < 5000) {
                        end_cost = 848
                    } else if (+$calc_cost.val() < 6000) {
                        end_cost = 873
                    } else if (+$calc_cost.val() < 7500) {
                        end_cost = 908
                    } else if (+$calc_cost.val() < 10000) {
                        end_cost = 953
                    } else if (+$calc_cost.val() < 15000) {
                        end_cost = 978
                    } else if (+$calc_cost.val() >= 15000) {
                        end_cost = ((+$calc_cost.val() * 0.07) + 119 + 59)
                    }
                }
            } else if ($calc_auction.val() === 'iaai') {
                if ($calc_category.val() === 'a') {
                    if (+$calc_cost.val() < 50) {
                        end_cost = 1 + 59
                    } else if (+$calc_cost.val() < 100) {
                        end_cost = 1 + 59
                    } else if (+$calc_cost.val() < 200) {
                        end_cost = 25 + 39 + 59
                    } else if (+$calc_cost.val() < 300) {
                        end_cost = 50 + 39 + 59
                    } else if (+$calc_cost.val() < 350) {
                        end_cost = 75 + 39 + 59
                    } else if (+$calc_cost.val() < 400) {
                        end_cost = 75 + 39 + 59
                    } else if (+$calc_cost.val() < 450) {
                        end_cost = 110 + 39 + 59
                    } else if (+$calc_cost.val() < 500) {
                        end_cost = 110 + 39 + 59
                    } else if (+$calc_cost.val() < 550) {
                        end_cost = 125 + 49 + 59
                    } else if (+$calc_cost.val() < 600) {
                        end_cost = 130 + 49 + 59
                    } else if (+$calc_cost.val() < 700) {
                        end_cost = 140 + 49 + 59
                    } else if (+$calc_cost.val() < 800) {
                        end_cost = 155 + 49 + 59
                    } else if (+$calc_cost.val() < 900) {
                        end_cost = 170 + 49 + 59
                    } else if (+$calc_cost.val() < 1000) {
                        end_cost = 185 + 49 + 59
                    } else if (+$calc_cost.val() < 1100) {
                        end_cost = 200 + 69 + 59
                    } else if (+$calc_cost.val() < 1200) {
                        end_cost = 200 + 69 + 59
                    } else if (+$calc_cost.val() < 1300) {
                        end_cost = 225 + 69 + 59
                    } else if (+$calc_cost.val() < 1400) {
                        end_cost = 240 + 69 + 59
                    } else if (+$calc_cost.val() < 1500) {
                        end_cost = 250 + 69 + 59
                    } else if (+$calc_cost.val() < 1600) {
                        end_cost = 260 + 79 + 59
                    } else if (+$calc_cost.val() < 1700) {
                        end_cost = 275 + 79 + 59
                    } else if (+$calc_cost.val() < 1800) {
                        end_cost = 285 + 79 + 59
                    } else if (+$calc_cost.val() < 2000) {
                        end_cost = 300 + 79 + 59
                    } else if (+$calc_cost.val() < 2200) {
                        end_cost = 325 + 89 + 59
                    } else if (+$calc_cost.val() < 2400) {
                        end_cost = 325 + 89 + 59
                    } else if (+$calc_cost.val() < 2500) {
                        end_cost = 335 + 89 + 59
                    } else if (+$calc_cost.val() < 2600) {
                        end_cost = 350 + 89 + 59
                    } else if (+$calc_cost.val() < 2800) {
                        end_cost = 350 + 89 + 59
                    } else if (+$calc_cost.val() < 3000) {
                        end_cost = 350 + 89 + 59
                    } else if (+$calc_cost.val() < 3500) {
                        end_cost = 400 + 89 + 59
                    } else if (+$calc_cost.val() < 4000) {
                        end_cost = 450 + 89 + 59
                    } else if (+$calc_cost.val() < 4500) {
                        end_cost = 575 + 99 + 59
                    } else if (+$calc_cost.val() < 5000) {
                        end_cost = 600 + 99 + 59
                    } else if (+$calc_cost.val() < 6000) {
                        end_cost = 625 + 99 + 59
                    } else if (+$calc_cost.val() < 7500) {
                        end_cost = 650 + 119 + 59
                    } else if (+$calc_cost.val() < 8000) {
                        end_cost = 675 + 119 + 59
                    } else if (+$calc_cost.val() < 10000) {
                        end_cost = 675 + 129 + 59
                    } else if (+$calc_cost.val() < 15000) {
                        end_cost = 700 + 129 + 59
                    } else if (+$calc_cost.val() >= 15000) {
                        end_cost = (+$calc_cost.val() * 0.055) + 129 + 59
                    }
                } else if ($calc_category.val() === 'c') {
                    if (+$calc_cost.val() < 50) {
                        end_cost = 25 + 59
                    } else if (+$calc_cost.val() < 100) {
                        end_cost = 45 + 59
                    } else if (+$calc_cost.val() < 200) {
                        end_cost = 80 + 39 + 59
                    } else if (+$calc_cost.val() < 300) {
                        end_cost = 120 + 39 + 59
                    } else if (+$calc_cost.val() < 350) {
                        end_cost = 120 + 39 + 59
                    } else if (+$calc_cost.val() < 400) {
                        end_cost = 120 + 39 + 59
                    } else if (+$calc_cost.val() < 450) {
                        end_cost = 160 + 39 + 59
                    } else if (+$calc_cost.val() < 500) {
                        end_cost = 160 + 39 + 59
                    } else if (+$calc_cost.val() < 550) {
                        end_cost = 185 + 49 + 59
                    } else if (+$calc_cost.val() < 600) {
                        end_cost = 185 + 49 + 59
                    } else if (+$calc_cost.val() < 700) {
                        end_cost = 210 + 49 + 59
                    } else if (+$calc_cost.val() < 800) {
                        end_cost = 230 + 49 + 59
                    } else if (+$calc_cost.val() < 900) {
                        end_cost = 250 + 49 + 59
                    } else if (+$calc_cost.val() < 1000) {
                        end_cost = 275 + 49 + 59
                    } else if (+$calc_cost.val() < 1100) {
                        end_cost = 325 + 69 + 59
                    } else if (+$calc_cost.val() < 1200) {
                        end_cost = 325 + 69 + 59
                    } else if (+$calc_cost.val() < 1300) {
                        end_cost = 350 + 69 + 59
                    } else if (+$calc_cost.val() < 1400) {
                        end_cost = 365 + 69 + 59
                    } else if (+$calc_cost.val() < 1500) {
                        end_cost = 380 + 69 + 59
                    } else if (+$calc_cost.val() < 1600) {
                        end_cost = 390 + 79 + 59
                    } else if (+$calc_cost.val() < 1700) {
                        end_cost = 410 + 79 + 59
                    } else if (+$calc_cost.val() < 1800) {
                        end_cost = 420 + 79 + 59
                    } else if (+$calc_cost.val() < 2000) {
                        end_cost = 440 + 79 + 59
                    } else if (+$calc_cost.val() < 2200) {
                        end_cost = 470 + 89 + 59
                    } else if (+$calc_cost.val() < 2400) {
                        end_cost = 470 + 89 + 59
                    } else if (+$calc_cost.val() < 2500) {
                        end_cost = 480 + 89 + 59
                    } else if (+$calc_cost.val() < 2600) {
                        end_cost = 500 + 89 + 59
                    } else if (+$calc_cost.val() < 2800) {
                        end_cost = 500 + 89 + 59
                    } else if (+$calc_cost.val() < 3000) {
                        end_cost = 500 + 89 + 59
                    } else if (+$calc_cost.val() < 3500) {
                        end_cost = 600 + 89 + 59
                    } else if (+$calc_cost.val() < 4000) {
                        end_cost = 650 + 89 + 59
                    } else if (+$calc_cost.val() < 4500) {
                        end_cost = 675 + 99 + 59
                    } else if (+$calc_cost.val() < 5000) {
                        end_cost = 700 + 99 + 59
                    } else if (+$calc_cost.val() < 6000) {
                        end_cost = 725 + 99 + 59
                    } else if (+$calc_cost.val() < 7500) {
                        end_cost = 750 + 119 + 59
                    } else if (+$calc_cost.val() < 8000) {
                        end_cost = 775 + 119 + 59
                    } else if (+$calc_cost.val() < 10000) {
                        end_cost = 775 + 129 + 59
                    } else if (+$calc_cost.val() < 15000) {
                        end_cost = 800 + 129 + 59
                    } else if (+$calc_cost.val() >= 15000) {
                        end_cost = (+$calc_cost.val() * 0.055) + 129 + 59
                    }
                }
            }

            $('#calc-self_cost').html(+$calc_cost.val() + end_cost)
            $('#calc-commission').html(end_cost)
        } else {
            $('#calc-self_cost').html(0)
            $('#calc-commission').html(0)
        }
    }
)

$calc_engine_type = $("#calc-engine_type")
$calc_engine_volume = $("#calc-engine_volume")
$calc_car_age = $("#calc-car_age")

let car_age_iter = [...Array(17).keys()]
let car_age_inner = []

car_age_iter.forEach((i) => {
    if (i <= 2 ) {
        car_age_inner.push((`<option value="${1}">${CURRENT_YEAR - i + ''}</option>`))
    } else if (i === 16) {
        car_age_inner.push((`<option value="${i-1}">${CURRENT_YEAR - i + ' и старше'}</option>`))
    } else {
        car_age_inner.push((`<option value="${i-1}">${CURRENT_YEAR - i + ''}</option>`))
    }

})


$calc_car_age.html(car_age_inner)

$calc_self_cost = $('#calc-self_cost')
$("#calc-engine_type, #calc-engine_volume, #calc-car_age, #calc-cost, #calc-auction, #calc-category").on('change', (event) => {
        let excise = 0
        let import_tax = 0
        let nds = 0
        if ($calc_cost.val() && $calc_engine_volume.val()) {
            if ($calc_engine_type.val() === 'petrol') {
                if (+$calc_engine_volume.val() <= 3000) {
                    excise = (+$calc_engine_volume.val() / 1000) * +$calc_car_age.val() * 50 * EUR_USD
                } else {
                    excise = (+$calc_engine_volume.val() / 1000) * +$calc_car_age.val() * 100 * EUR_USD
                }
                import_tax = (+$calc_self_cost.html() + 1000) * 0.1
                nds = (excise + +$calc_self_cost.html() + 1000 + +import_tax) * 0.2
            } else if ($calc_engine_type.val() === 'diesel') {
                if (+$calc_engine_volume.val() <= 3500) {
                    excise = (+$calc_engine_volume.val() / 1000) * +$calc_car_age.val() * 75 * EUR_USD
                } else {
                    excise = (+$calc_engine_volume.val() / 1000) * +$calc_car_age.val() * 150 * EUR_USD
                }
                import_tax = (+$calc_self_cost.html() + 1000) * 0.1
                nds = (excise + +$calc_self_cost.html() + 1000 + +import_tax) * 0.2
            } else if ($calc_engine_type.val() === 'electric') {
                excise = +$calc_engine_volume.val() * EUR_USD
                import_tax = 0
                nds = 0
            } else if ($calc_engine_type.val() === 'hybrid') {
                excise = 100 * EUR_USD
                import_tax = (+$calc_self_cost.html() + 1000) * 0.1
                nds = (excise + +$calc_self_cost.html() + 1000 + +import_tax) * 0.2
            }
            let tax = excise + import_tax + nds
            $('#calc-tax-import').html(Math.round(import_tax * 100) / 100)
            $('#calc-tax-ac').html(Math.round(excise * 100) / 100)
            $('#calc-tax-nds').html(Math.round(nds * 100) / 100)
            $('#calc-tax').html(Math.round(tax * 100) / 100)
        } else {
            $('#calc-tax-import').html(0)
            $('#calc-tax-ac').html(0)
            $('#calc-tax-nds').html(0)
            $('#calc-tax').html(0)
        }
    }
)


let $calc_insurance = $('#calc-insurance')
let $calc_dop_port = $('#calc-dop-port')
let $calc_dop_account = $('#calc-dop-account')

$('#calc-insurance, #calc-dop-port, #calc-dop-account, #calc-cost').on('change', () => {
    let insurance = +$calc_insurance.val() * +$calc_cost.val() / 100
    $('#dop-insurance').html(insurance)
    $('#dop-tax').html(insurance + +$calc_dop_port.val() + +$calc_dop_account.val())
})


$('#calc-out').change(function () {
    $("#result_cost").html((Math.round(+$('#delivery-price').html() + +$('#calc-self_cost').html() + +$('#calc-tax').html() + +$('#dop-tax').html()) * 100) / 100)
})

$('#america-calc').on('click', () => {
    $('#calc-out').css("display", "block")
    $('#ca-calc-out').css("display", "none")
})
$('#canada-calc').on('click', () => {
    $('#calc-out').css("display", "none")
    $('#ca-calc-out').css("display", "block")
})

//Канада

let ca_data = {
    "QC": [
        ["Montreal", 100, 100],
        ["Quebec City", 250, null],
        ["Mascouche", 200, null],
        ["St-Philibert", null, 450],
        ["Riviere-du-Loup", null, 550],
        ["St-Hubert", null, 550],
        ["Chicoutimi", null, 650],
        ["Matane", null, 700],
        ["Noranda", null, 750],
        ["Grand Riviere", 950, null]
    ], "ON": [
        ["Ottawa", 250, 250],
        ["Toronto", 300, 325],
        ["Hamilton", 400, null],
        ["London", 425, 425],
        ["Sudbury", 475, null],
        ["Winchester", 250, 250],
        ["Stouffville", 350, null],
        ["Gary's Towing", 950, null],
        ["Kenora,ON", 950, null],
        ["Thunder Bay", 950, null]
    ], "NB": [
        ["Moncton", 575, 575]
    ], "NS": [
        ["Halifax", 675, 675]
    ], "NF": [
        ["St-Johns", 1350, 1350]
    ], "MB": [
        ["Manitoba/Winnipeg", 1150, null]
    ], "AB": [
        ["Calgary", 1250, 1250],
        ["Edmonton", 1250, 1250],
        ["Claimont", null, 1850]
    ], "BC": [
        ["Vancouver", 1800, null],
        ["Abbotsford", null, 1800]
    ]
}
let $ca_places = $('#ca-places')
$ca_places.select2({
    searchInputPlaceholder: "Поиск"
})


let $ca_car_type = $('#ca-car-type')
let ca_places_inner = ['<option>Выберите аукцион</option>']

for (let i in ca_data) {
    ca_places_inner.push(`<optgroup label="${i}">`)
    ca_data[i].forEach((j) => {
        if (j[1]) {
            ca_places_inner.push(`<option value='${j[1]}' data-port="">${j[0]} - IAAI</option>`)
        }
        if (j[2]) {
            ca_places_inner.push(`<option value='${j[2]}' data-port="">${j[0]} - Copart</option>`)
        }
    })
}

$ca_places.html(ca_places_inner)

$('#ca-places, #ca-car-type').on('change', (e) => {
    let ca_place = $ca_places.val()
    let ca_car_type = $ca_car_type.val()
    let ca_ocean_shipping = 850 + 50
    let delivery_price
    if (ca_car_type === "Седан" || ca_car_type === "Кроссовер") {
        delivery_price = ca_ocean_shipping + +ca_place
    } else if (ca_car_type === "Пикап") {
        delivery_price = (ca_ocean_shipping * 2) + +ca_place
    } else {
        delivery_price = 0
    }
    console.log(delivery_price)
    console.log(delivery_price)
    if (isNaN(delivery_price)) {
        delivery_price = 0
    } else if (delivery_price > 0) {
        delivery_price += EXTRA_CHARGE_CA
    }
    $('#ca-delivery-price').html(delivery_price)
})


$('#car-type').on('change', (e) => {

    let $ports = $('#ports')
    let port = $('#ports option:selected').attr('data-port')
    let ocean_shipping = $ports.attr('data-shipping')
    let delivery_price
    let $car_type = $('#car-type').val()
    if ($car_type === "Седан" || $car_type === "Кроссовер") {
        delivery_price = +ocean_shipping + +$ports.val()
    } else if ($car_type === "Пикап") {
        if (port === 'Los Angeles') {
            delivery_price = (+ocean_shipping + 200) + +$ports.val()
        } else {
            delivery_price = (+ocean_shipping * 2) + +$ports.val()
        }
    } else {
        delivery_price = 0
    }
    if (isNaN(delivery_price)) {
        delivery_price = 0
    } else if (delivery_price > 0) {
        delivery_price += EXTRA_CHARGE
    }
    $('#delivery-price').html(delivery_price)
})


let ca_cal_cost = function () {
    $ca_calc_cost = $("#ca-calc-cost")
    $ca_calc_auction = $("#ca-calc-auction")
    $ca_calc_category = $("#ca-calc-category")
    let ca_end_cost = null
    $("#ca-calc-cost, #ca-calc-auction, #ca-calc-category").on('change', (event) => {
            if ($ca_calc_cost.val() !== '') {
                if ($ca_calc_auction.val() === 'copart') {
                    if ($ca_calc_category.val() === 'a') {
                        if (+$ca_calc_cost.val() < 100) {
                            ca_end_cost = 60
                        } else if (+$ca_calc_cost.val() < 200) {
                            ca_end_cost = 113
                        } else if (+$ca_calc_cost.val() < 300) {
                            ca_end_cost = 138
                        } else if (+$ca_calc_cost.val() < 400) {
                            ca_end_cost = 163
                        } else if (+$ca_calc_cost.val() < 500) {
                            ca_end_cost = 198
                        } else if (+$ca_calc_cost.val() < 550) {
                            ca_end_cost = 223
                        } else if (+$ca_calc_cost.val() < 600) {
                            ca_end_cost = 228
                        } else if (+$ca_calc_cost.val() < 700) {
                            ca_end_cost = 238
                        } else if (+$ca_calc_cost.val() < 800) {
                            ca_end_cost = 253
                        } else if (+$ca_calc_cost.val() < 900) {
                            ca_end_cost = 268
                        } else if (+$ca_calc_cost.val() < 1000) {
                            ca_end_cost = 283
                        } else if (+$ca_calc_cost.val() < 1200) {
                            ca_end_cost = 318
                        } else if (+$ca_calc_cost.val() < 1300) {
                            ca_end_cost = 343
                        } else if (+$ca_calc_cost.val() < 1400) {
                            ca_end_cost = 358
                        } else if (+$ca_calc_cost.val() < 1500) {
                            ca_end_cost = 368
                        } else if (+$ca_calc_cost.val() < 1600) {
                            ca_end_cost = 388
                        } else if (+$ca_calc_cost.val() < 1700) {
                            ca_end_cost = 403
                        } else if (+$ca_calc_cost.val() < 1800) {
                            ca_end_cost = 413
                        } else if (+$ca_calc_cost.val() < 2000) {
                            ca_end_cost = 428
                        } else if (+$ca_calc_cost.val() < 2400) {
                            ca_end_cost = 463
                        } else if (+$ca_calc_cost.val() < 2500) {
                            ca_end_cost = 473
                        } else if (+$ca_calc_cost.val() < 3000) {
                            ca_end_cost = 488
                        } else if (+$ca_calc_cost.val() < 3500) {
                            ca_end_cost = 538
                        } else if (+$ca_calc_cost.val() < 4000) {
                            ca_end_cost = 588
                        } else if (+$ca_calc_cost.val() < 4500) {
                            ca_end_cost = 723
                        } else if (+$ca_calc_cost.val() < 5000) {
                            ca_end_cost = 748
                        } else if (+$ca_calc_cost.val() < 6000) {
                            ca_end_cost = 773
                        } else if (+$ca_calc_cost.val() < 7500) {
                            ca_end_cost = 808
                        } else if (+$ca_calc_cost.val() < 10000) {
                            ca_end_cost = 833
                        } else if (+$ca_calc_cost.val() < 15000) {
                            ca_end_cost = 878
                        } else if (+$ca_calc_cost.val() >= 15000) {
                            ca_end_cost = ((+$ca_calc_cost.val() * 0.055) + 119 + 59)
                        }
                    } else if ($ca_calc_category.val() === 'c') {
                        if (+$ca_calc_cost.val() < 100) {
                            ca_end_cost = 104
                        } else if (+$ca_calc_cost.val() < 200) {
                            ca_end_cost = 168
                        } else if (+$ca_calc_cost.val() < 300) {
                            ca_end_cost = 208
                        } else if (+$ca_calc_cost.val() < 400) {
                            ca_end_cost = 208
                        } else if (+$ca_calc_cost.val() < 500) {
                            ca_end_cost = 248
                        } else if (+$ca_calc_cost.val() < 550) {
                            ca_end_cost = 283
                        } else if (+$ca_calc_cost.val() < 600) {
                            ca_end_cost = 283
                        } else if (+$ca_calc_cost.val() < 700) {
                            ca_end_cost = 308
                        } else if (+$ca_calc_cost.val() < 800) {
                            ca_end_cost = 328
                        } else if (+$ca_calc_cost.val() < 900) {
                            ca_end_cost = 348
                        } else if (+$ca_calc_cost.val() < 1000) {
                            ca_end_cost = 373
                        } else if (+$ca_calc_cost.val() < 1200) {
                            ca_end_cost = 443
                        } else if (+$ca_calc_cost.val() < 1300) {
                            ca_end_cost = 468
                        } else if (+$ca_calc_cost.val() < 1400) {
                            ca_end_cost = 483
                        } else if (+$ca_calc_cost.val() < 1500) {
                            ca_end_cost = 498
                        } else if (+$ca_calc_cost.val() < 1600) {
                            ca_end_cost = 518
                        } else if (+$ca_calc_cost.val() < 1700) {
                            ca_end_cost = 538
                        } else if (+$ca_calc_cost.val() < 1800) {
                            ca_end_cost = 548
                        } else if (+$ca_calc_cost.val() < 2000) {
                            ca_end_cost = 568
                        } else if (+$ca_calc_cost.val() < 2400) {
                            ca_end_cost = 608
                        } else if (+$ca_calc_cost.val() < 2500) {
                            ca_end_cost = 618
                        } else if (+$ca_calc_cost.val() < 3000) {
                            ca_end_cost = 638
                        } else if (+$ca_calc_cost.val() < 3500) {
                            ca_end_cost = 738
                        } else if (+$ca_calc_cost.val() < 4000) {
                            ca_end_cost = 788
                        } else if (+$ca_calc_cost.val() < 4500) {
                            ca_end_cost = 823
                        } else if (+$ca_calc_cost.val() < 5000) {
                            ca_end_cost = 848
                        } else if (+$ca_calc_cost.val() < 6000) {
                            ca_end_cost = 873
                        } else if (+$ca_calc_cost.val() < 7500) {
                            ca_end_cost = 908
                        } else if (+$ca_calc_cost.val() < 10000) {
                            ca_end_cost = 953
                        } else if (+$ca_calc_cost.val() < 15000) {
                            ca_end_cost = 978
                        } else if (+$ca_calc_cost.val() >= 15000) {
                            ca_end_cost = ((+$ca_calc_cost.val() * 0.07) + 119 + 59)
                        }
                    }
                } else if ($ca_calc_auction.val() === 'iaai') {
                    if ($ca_calc_category.val() === 'a') {
                        if (+$ca_calc_cost.val() < 50) {
                            ca_end_cost = 1 + 59
                        } else if (+$ca_calc_cost.val() < 100) {
                            ca_end_cost = 1 + 59
                        } else if (+$ca_calc_cost.val() < 200) {
                            ca_end_cost = 25 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 300) {
                            ca_end_cost = 50 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 350) {
                            ca_end_cost = 75 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 400) {
                            ca_end_cost = 75 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 450) {
                            ca_end_cost = 110 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 500) {
                            ca_end_cost = 110 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 550) {
                            ca_end_cost = 125 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 600) {
                            ca_end_cost = 130 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 700) {
                            ca_end_cost = 140 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 800) {
                            ca_end_cost = 155 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 900) {
                            ca_end_cost = 170 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 1000) {
                            ca_end_cost = 185 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 1100) {
                            ca_end_cost = 200 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1200) {
                            ca_end_cost = 200 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1300) {
                            ca_end_cost = 225 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1400) {
                            ca_end_cost = 240 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1500) {
                            ca_end_cost = 250 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1600) {
                            ca_end_cost = 260 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 1700) {
                            ca_end_cost = 275 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 1800) {
                            ca_end_cost = 285 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 2000) {
                            ca_end_cost = 300 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 2200) {
                            ca_end_cost = 325 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2400) {
                            ca_end_cost = 325 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2500) {
                            ca_end_cost = 335 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2600) {
                            ca_end_cost = 350 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2800) {
                            ca_end_cost = 350 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 3000) {
                            ca_end_cost = 350 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 3500) {
                            ca_end_cost = 400 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 4000) {
                            ca_end_cost = 450 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 4500) {
                            ca_end_cost = 575 + 99 + 59
                        } else if (+$ca_calc_cost.val() < 5000) {
                            ca_end_cost = 600 + 99 + 59
                        } else if (+$ca_calc_cost.val() < 6000) {
                            ca_end_cost = 625 + 99 + 59
                        } else if (+$ca_calc_cost.val() < 7500) {
                            ca_end_cost = 650 + 119 + 59
                        } else if (+$ca_calc_cost.val() < 8000) {
                            ca_end_cost = 675 + 119 + 59
                        } else if (+$ca_calc_cost.val() < 10000) {
                            ca_end_cost = 675 + 129 + 59
                        } else if (+$ca_calc_cost.val() < 15000) {
                            ca_end_cost = 700 + 129 + 59
                        } else if (+$ca_calc_cost.val() >= 15000) {
                            ca_end_cost = (+$ca_calc_cost.val() * 0.055) + 129 + 59
                        }
                    } else if ($ca_calc_category.val() === 'c') {
                        if (+$ca_calc_cost.val() < 50) {
                            ca_end_cost = 25 + 59
                        } else if (+$ca_calc_cost.val() < 100) {
                            ca_end_cost = 45 + 59
                        } else if (+$ca_calc_cost.val() < 200) {
                            ca_end_cost = 80 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 300) {
                            ca_end_cost = 120 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 350) {
                            ca_end_cost = 120 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 400) {
                            ca_end_cost = 120 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 450) {
                            ca_end_cost = 160 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 500) {
                            ca_end_cost = 160 + 39 + 59
                        } else if (+$ca_calc_cost.val() < 550) {
                            ca_end_cost = 185 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 600) {
                            ca_end_cost = 185 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 700) {
                            ca_end_cost = 210 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 800) {
                            ca_end_cost = 230 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 900) {
                            ca_end_cost = 250 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 1000) {
                            ca_end_cost = 275 + 49 + 59
                        } else if (+$ca_calc_cost.val() < 1100) {
                            ca_end_cost = 325 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1200) {
                            ca_end_cost = 325 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1300) {
                            ca_end_cost = 350 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1400) {
                            ca_end_cost = 365 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1500) {
                            ca_end_cost = 380 + 69 + 59
                        } else if (+$ca_calc_cost.val() < 1600) {
                            ca_end_cost = 390 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 1700) {
                            ca_end_cost = 410 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 1800) {
                            ca_end_cost = 420 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 2000) {
                            ca_end_cost = 440 + 79 + 59
                        } else if (+$ca_calc_cost.val() < 2200) {
                            ca_end_cost = 470 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2400) {
                            ca_end_cost = 470 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2500) {
                            ca_end_cost = 480 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2600) {
                            ca_end_cost = 500 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 2800) {
                            ca_end_cost = 500 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 3000) {
                            ca_end_cost = 500 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 3500) {
                            ca_end_cost = 600 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 4000) {
                            ca_end_cost = 650 + 89 + 59
                        } else if (+$ca_calc_cost.val() < 4500) {
                            ca_end_cost = 675 + 99 + 59
                        } else if (+$ca_calc_cost.val() < 5000) {
                            ca_end_cost = 700 + 99 + 59
                        } else if (+$ca_calc_cost.val() < 6000) {
                            ca_end_cost = 725 + 99 + 59
                        } else if (+$ca_calc_cost.val() < 7500) {
                            ca_end_cost = 750 + 119 + 59
                        } else if (+$ca_calc_cost.val() < 8000) {
                            ca_end_cost = 775 + 119 + 59
                        } else if (+$ca_calc_cost.val() < 10000) {
                            ca_end_cost = 775 + 129 + 59
                        } else if (+$ca_calc_cost.val() < 15000) {
                            ca_end_cost = 800 + 129 + 59
                        } else if (+$ca_calc_cost.val() >= 15000) {
                            ca_end_cost = (+$ca_calc_cost.val() * 0.055) + 129 + 59
                        }
                    }
                }

                $('#ca-calc-self_cost').html(+$ca_calc_cost.val() + ca_end_cost)
                $('#ca-calc-commission').html(ca_end_cost)
            } else {
                $('#ca-calc-self_cost').html(0)
                $('#ca-calc-commission').html(0)
            }
        }
    )
};ca_cal_cost()

$ca_calc_engine_type = $("#ca-calc-engine_type")
$ca_calc_engine_volume = $("#ca-calc-engine_volume")
$ca_calc_car_age = $('#ca-calc-car_age')

$ca_calc_car_age.html(car_age_inner)

let $ca_calc_self_cost = $('#ca-calc-self_cost')
$("#ca-calc-engine_type, #ca-calc-engine_volume, #ca-calc-car_age, #ca-calc-cost, #ca-calc-auction, #ca-calc-category").on('change', (event) => {
        let excise = 0
        let import_tax = 0
        let nds = 0
        if ($ca_calc_cost.val() && $ca_calc_engine_volume.val()) {
            if ($ca_calc_engine_type.val() === 'petrol') {
                if (+$ca_calc_engine_volume.val() <= 3000) {
                    excise = (+$ca_calc_engine_volume.val() / 1000) * +$ca_calc_car_age.val() * 50 * EUR_USD
                } else {
                    excise = (+$ca_calc_engine_volume.val() / 1000) * +$ca_calc_car_age.val() * 100 * EUR_USD
                }
                import_tax = (+$ca_calc_self_cost.html() + 1000) * 0.1
                nds = (excise + +$ca_calc_self_cost.html() + 1000 + +import_tax) * 0.2
            } else if ($ca_calc_engine_type.val() === 'diesel') {
                if (+$ca_calc_engine_volume.val() <= 3500) {
                    excise = (+$ca_calc_engine_volume.val() / 1000) * +$ca_calc_car_age.val() * 75 * EUR_USD
                } else {
                    excise = (+$ca_calc_engine_volume.val() / 1000) * +$ca_calc_car_age.val() * 150 * EUR_USD
                }
                import_tax = (+$ca_calc_self_cost.html() + 1000) * 0.1
                nds = (excise + +$ca_calc_self_cost.html() + 1000 + +import_tax) * 0.2
            } else if ($ca_calc_engine_type.val() === 'electric') {
                excise = +$ca_calc_engine_volume.val() * EUR_USD
                import_tax = 0
                nds = 0
            } else if ($ca_calc_engine_type.val() === 'hybrid') {
                excise = 100 * EUR_USD
                import_tax = (+$ca_calc_self_cost.html() + 1000) * 0.1
                nds = (excise + +$ca_calc_self_cost.html() + 1000 + +import_tax) * 0.2
            }
            let tax = excise + import_tax + nds
            $('#ca-calc-tax-import').html(Math.round(import_tax * 100) / 100)
            $('#ca-calc-tax-ac').html(Math.round(excise * 100) / 100)
            $('#ca-calc-tax-nds').html(Math.round(nds * 100) / 100)
            $('#ca-calc-tax').html(Math.round(tax * 100) / 100)
        } else {
            $('#ca-calc-tax-import').html(0)
            $('#ca-calc-tax-ac').html(0)
            $('#ca-calc-tax-nds').html(0)
            $('#ca-calc-tax').html(0)
        }
    }
)


let $ca_calc_insurance = $('#ca-calc-insurance')
let $ca_calc_dop_port = $('#ca-calc-dop-port')
let $ca_calc_dop_account = $('#ca-calc-dop-account')

$('#ca-calc-insurance, #ca-calc-dop-port, #ca-calc-dop-account, #ca-calc-cost').on('change', () => {
    let insurance = +$ca_calc_insurance.val() * +$ca_calc_cost.val() / 100
    $('#ca-dop-insurance').html(insurance)
    $('#ca-dop-tax').html(insurance + +$ca_calc_dop_port.val() + +$ca_calc_dop_account.val())
})


$('#ca-calc-out').change(function () {
    $("#ca-result_cost").html((Math.round(+$('#ca-delivery-price').html() + +$('#ca-calc-self_cost').html() + +$('#ca-calc-tax').html() + +$('#ca-dop-tax').html()) * 100) / 100)
})
