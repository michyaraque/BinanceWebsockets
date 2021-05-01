var currencies = [{
        crypto_name: 'btc',
        change: 'usdt',
        type: 'aggTrade'
    }, {
        crypto_name: 'doge',
        change: 'usdt',
        type: 'aggTrade'
    }, {
        crypto_name: 'xlm',
        change: 'usdt',
        type: 'aggTrade'
    }, {
        crypto_name: 'stmx',
        change: 'usdt',
        type: 'aggTrade'
    }, {
        crypto_name: 'eth',
        change: 'usdt',
        type: 'aggTrade'
    },
    {
        crypto_name: 'btt',
        change: 'usdt',
        type: 'aggTrade'
    }
];

var purchases_data = [];

function rotate($el, degrees) {
    $el.css({
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-moz-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        '-o-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)',
        'zoom': 1,
        'transition-timing-function': 'ease'
    });
}

function setCryptoCard(handler, my_coins, my_invest, coin_name) {
    let msgs = JSON.parse(handler.data);

    var getExactDecimal = function(crypto_value) {
        let actual_value = parseFloat(crypto_value);
        let split_value = actual_value.toString().split('.');
        if (split_value[0] > 0) {
            var crypto_fixed_value = actual_value.toFixed(2);
        } else if (split_value[0] < 1) {
            var crypto_fixed_value = actual_value.toFixed(7);
        }
        return crypto_fixed_value;
    }

    if (msgs.m === false) {
        $("#" + coin_name + "_actual_value").removeClass('text-danger').addClass('text-success').text(getExactDecimal(msgs.p) + " ▲");
    } else {
        $("#" + coin_name + "_actual_value").removeClass('text-success').addClass('text-danger').text(getExactDecimal(msgs.p) + " ▼");
    }

    const coin_value = msgs.p;
    var my_total_value = (coin_value * my_coins).toFixed(5);
    var my_gain = my_total_value - my_invest;
    $("#" + coin_name + "_funds").text("Saldo: " + (my_total_value) + "$");
    $("#" + coin_name + "_gains").text("Ganancia: " + (my_gain).toFixed(5) + "$ (" + (my_invest * my_gain / 100).toFixed(2) + "%)");


    if (typeof purchases_data[coin_name] == 'undefined') {
        purchases_data[coin_name] = {
            buy: 0,
            sell: 0
        };
    }
    purchases_data[coin_name] = {
        buy: (msgs.m === false ? ++purchases_data[coin_name].buy : purchases_data[coin_name].buy),
        sell: (msgs.m === false ? purchases_data[coin_name].sell : ++purchases_data[coin_name].sell)
    };
    let buys = purchases_data[coin_name].buy;
    let sells = purchases_data[coin_name].sell;
    let total_value = buys + sells;
    var percentage_buys = buys * 100 / total_value;
    let percentage_sells = sells * 100 / total_value;
    $("#" + coin_name + "_bar_buys").css("width", percentage_buys + "%").text(buys);
    $("#" + coin_name + "_bar_sells").css("width", percentage_sells + "%").text(sells);

    var setDegrees = function(percent) {
        const min = 135,
            max = -45;
        let get_percent_value = (percent / 100) * (max - min);
        let final_percent = get_percent_value + min;
        return final_percent;
    };

    rotate($("#" + coin_name + "_rocket"), setDegrees(percentage_buys));
}

var i, socket_request = '',
    localStorage = [];

function createCurrencyRibbon(crypto_name, crypto_change) {
    return crypto_name.toUpperCase() + "/" + crypto_change;
}

function createCardBox(crypto_name, crypto_change) {
    $(".cctr").append(function() {
        return $("<div/>").addClass("col-sm-4")
            .append($("<div/>")
                .append($("<h4/>").html(createCurrencyRibbon(crypto_name, crypto_change))
                    .append($("<button/>").append($('<i/>').addClass('fas fa-edit')).attr('type', 'button')
                    .addClass('btn btn-sm btn-default currency_open_modal text-gray').attr('data-currency-name', crypto_name).attr('data-currency-type', crypto_change))
                    .addClass("card-header d-flex justify-content-between align-items-center"))
                .append($("<div/>").addClass("card-body")

                    .append($("<div/>").addClass("text-left position-absolute").css({ 'transition': 'transform 0.6s cubic-bezier(0.37, 0, 0.63, 1)', 'z-index': '10' }).attr('id', crypto_name + "_rocket").append($("<h1/>").html("🚀")))
                    .append($("<div/>").append($("<h5/>").html('0.00000000').attr("id", crypto_name + "_actual_value"))
                        .append($("<span/>").html('Saldo: 0.00000$').attr("id", crypto_name + "_funds")).append($("<br/>"))
                        .append($("<span/>").html('Ganacia: 0.00000$').attr("id", crypto_name + "_gains")).append($("<br/>"))
                        .append($("<div/>").addClass("progress")
                            .append($("<div/>").addClass("progress-bar bg-success").attr('id', crypto_name + '_bar_buys'))
                            .append($("<div/>").addClass("progress-bar bg-danger").attr('id', crypto_name + '_bar_sells')))
                        .addClass("text-right")))
                .addClass("card"))
    });
}

function createModalLint(crypto_name, crypto_change) {
    $("body").append(`<div class="modal fade action-sheet " id="currency_modal" tabindex="-1" role="dialog" aria-modal="true">
<div class="modal-dialog modal-dialog-centered modal-sm" role="document">
    <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title">${createCurrencyRibbon(crypto_name, crypto_change)}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
        
            <div class="action-sheet-content">
                <form>
                    <div class="form-group">

                    <div class="input-wrapper">
                            <label class="label" for="account2d">Monedas compradas</label>
                            <div class="input-group">
                                <input class="form-control" id="crypto_buyed_coins" type="number" inputmode="decimal"required>
                                <div class="input-group-append">
                                    <span class="input-group-text" id="inputGroupPrepend2"><i class="fas fa-coins"></i></span>
                                </div>
                            </div>
                        </div>

                        <div class="input-wrapper">
                            <label class="label" for="account2d">Dinero invertido ($)</label>
                            <div class="input-group">
                                <input class="form-control" id="crypto_my_invest" type="number" inputmode="decimal" required>
                                <div class="input-group-append">
                                    <span class="input-group-text" id="inputGroupPrepend2"><i class="fas fa-money-bill"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <button id="crypto_modal_update" type="button" class="btn btn-primary btn-block btn-me">Actualizar</button>
                        <button id="crypto_local_delete" type="button" class="btn btn-danger btn-block btn-sm">Eliminar datos guardados</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</div>`)
}


function createCardGrid() {
    for (i = 0; i < currencies.length; i++) {
        createCardBox(currencies[i].crypto_name, currencies[i].change);
    }
}

function setLocalData(crypto_name, coins, my_actual_invest) {
    var objectValues = { 'my_actual_coins': coins, 'my_actual_invest': my_actual_invest, };
    localStorage.setItem(crypto_name + "_values", JSON.stringify(objectValues));
}

function getCryptos() {
    data = [];
    for (i = 0; i < currencies.length; i++) {
        data.push(currencies[i].crypto_name);
    }
    return data;
}

function createSocketUrl() {
    for (i = 0; i < currencies.length; i++) {
        socket_request += currencies[i].crypto_name + currencies[i].change + "@" + currencies[i].type + (currencies.length === (i + 1) ? "" : "/");
    }
    return socket_request;
}


$(document).ready(function() {

    $(this).on("click", ".currency_open_modal", function() {
        var currency_name = $(this).attr('data-currency-name');
        var currency_change = $(this).attr('data-currency-type');

        var modal = $('#currency_modal');
        modal.find('.modal-title').text(currency_name.toUpperCase() + "/" + currency_change)
        $("#crypto_modal_update").attr('data-currency-name', currency_name);

        $('#currency_modal').modal({
            show: true
        });
    });

    $(this).on("click", "#crypto_modal_update", function(event) {
        event.preventDefault();
        var currency_name = $(this).attr('data-currency-name');
        let coin_my_actual_invest = $("#crypto_my_invest").val();
        let my_actual_coins = $("#crypto_buyed_coins").val();
        if (coin_my_actual_invest !== '' && my_actual_coins !== '') {
            setLocalData(currency_name, my_actual_coins, coin_my_actual_invest);
            $("#crypto_my_invest, #crypto_buyed_coins").val('');
            $("#currency_modal").modal('hide')
        }
    });

    $(this).on("click", "#crypto_local_delete", function(evt) {
        var currency_name = $("#crypto_modal_update").attr('data-currency-name');
        setLocalData(currency_name, 0, 0);
        $("#currency_modal").modal('hide')
    });

});

let ws = new WebSocket("wss://stream.binance.com:9443/ws/" + createSocketUrl());

ws.onopen = function() {
    createCardGrid();
    createModalLint("", "");
};

ws.onmessage = function(evt) {
    let data = JSON.parse(evt.data);

    if (data.e === 'aggTrade') {
        receive_signal = data.s.replace("USDT", "").toLowerCase();
        if (data = getCryptos().includes(receive_signal)) {
            data = JSON.parse(localStorage.getItem(receive_signal + '_values'))
            if (data === null) {
                setLocalData(receive_signal, 0, 0);
            } else if (data !== '') {
                setCryptoCard(evt, data['my_actual_coins'], data['my_actual_invest'], receive_signal);
            }
        }
    }

    if (evt === 'ping') {
        ws.send('pong');
    }
}
