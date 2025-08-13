/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8104265402843602, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "04_07_Proceed to Checkout"], "isController": true}, {"data": [1.0, 500, 1500, "03_07_Sign Out-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_02_Click Sign In"], "isController": false}, {"data": [0.5, 500, 1500, "04_03_Sign in "], "isController": true}, {"data": [1.0, 500, 1500, "03_07_Sign Out-1"], "isController": false}, {"data": [0.5, 500, 1500, "03_01_Open URL"], "isController": true}, {"data": [0.5, 500, 1500, "04_06_Add to Cart"], "isController": true}, {"data": [0.5, 500, 1500, "04_05_Select Product ID"], "isController": true}, {"data": [0.9375, 500, 1500, "03_03_Sign in "], "isController": true}, {"data": [1.0, 500, 1500, "03_03_Sign In-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_03_Sign In"], "isController": false}, {"data": [0.9977973568281938, 500, 1500, "02-Search"], "isController": false}, {"data": [1.0, 500, 1500, "03_06_Add to Cart"], "isController": true}, {"data": [1.0, 500, 1500, "03_03_Sign In-1"], "isController": false}, {"data": [0.5041407867494824, 500, 1500, "01_Open_URL"], "isController": true}, {"data": [0.5, 500, 1500, "04_09_Confirm Details"], "isController": true}, {"data": [1.0, 500, 1500, "03_07_Sign Out"], "isController": true}, {"data": [0.49415515409139216, 500, 1500, "01-Open"], "isController": false}, {"data": [0.5, 500, 1500, "04_08_Key in Payment Details"], "isController": true}, {"data": [1.0, 500, 1500, "03_02_Click on Sign In"], "isController": true}, {"data": [1.0, 500, 1500, "03_05_Select Product ID"], "isController": true}, {"data": [0.9975514201762977, 500, 1500, "02_02_Select_Category"], "isController": true}, {"data": [0.9979959919839679, 500, 1500, "02_03_Select Product ID (Fish)"], "isController": false}, {"data": [0.9946524064171123, 500, 1500, "02_Search_URL"], "isController": true}, {"data": [0.997029702970297, 500, 1500, "02_03_Select Product ID"], "isController": true}, {"data": [0.25, 500, 1500, "04_10_Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "04_03_Sign in -1"], "isController": false}, {"data": [0.9979777553083923, 500, 1500, "02_04_Select Item ID (Fish)"], "isController": true}, {"data": [1.0, 500, 1500, "04_03_Sign in -0"], "isController": false}, {"data": [0.4951737451737452, 500, 1500, "02_01_Enter Store"], "isController": true}, {"data": [1.0, 500, 1500, "03-04_View Categories"], "isController": true}, {"data": [1.0, 500, 1500, "04_10_Sign Out-1"], "isController": false}, {"data": [0.5, 500, 1500, "04-04_View Categories"], "isController": true}, {"data": [1.0, 500, 1500, "04_02_Click on Sign In"], "isController": true}, {"data": [0.5, 500, 1500, "04_10_Sign Out-0"], "isController": false}, {"data": [0.5, 500, 1500, "04_01_Open URL"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4090, 0, 0.0, 465.1117359413206, 0, 17820, 260.0, 892.9000000000001, 960.0, 1203.7100000000028, 41.31647001777922, 168.27056179413486, 27.711756379303377], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["04_07_Proceed to Checkout", 2, 0, 0.0, 2750.5, 263, 5238, 2750.5, 5238.0, 5238.0, 5238.0, 0.3818251240931653, 2.0746826078655976, 0.24013220694921725], "isController": true}, {"data": ["03_07_Sign Out-0", 8, 0, 0.0, 204.75, 161, 263, 202.5, 263.0, 263.0, 263.0, 0.3034440904263389, 0.06815638749810347, 0.1899488886360188], "isController": false}, {"data": ["03_02_Click Sign In", 16, 0, 0.0, 237.74999999999997, 190, 288, 234.5, 287.3, 288.0, 288.0, 0.1853138753764188, 0.7409840456335418, 0.1107539958304378], "isController": false}, {"data": ["04_03_Sign in ", 2, 0, 0.0, 3060.0, 406, 5714, 3060.0, 5714.0, 5714.0, 5714.0, 0.35001750087504374, 1.8365664376968847, 0.5725383925446272], "isController": true}, {"data": ["03_07_Sign Out-1", 8, 0, 0.0, 187.5, 155, 212, 195.5, 212.0, 212.0, 212.0, 0.30319108618206625, 1.4946373076631547, 0.18712574850299402], "isController": false}, {"data": ["03_01_Open URL", 32, 0, 0.0, 820.625, 709, 1096, 807.5, 893.0, 1096.0, 1096.0, 0.3682859740588567, 1.9128212431953413, 0.19834933075533154], "isController": true}, {"data": ["04_06_Add to Cart", 2, 0, 0.0, 3303.5, 249, 6358, 3303.5, 6358.0, 6358.0, 6358.0, 0.31456432840515886, 1.477592206668764, 0.20428249842717838], "isController": true}, {"data": ["04_05_Select Product ID", 2, 0, 0.0, 2916.5, 240, 5593, 2916.5, 5593.0, 5593.0, 5593.0, 0.3575898444484177, 1.3818193500804576, 0.2311762470945825], "isController": true}, {"data": ["03_03_Sign in ", 16, 0, 0.0, 1358.1875, 0, 17820, 399.0, 5696.000000000013, 17820.0, 17820.0, 0.18575707618362086, 0.6091752748624236, 0.1899066788376251], "isController": true}, {"data": ["03_03_Sign In-0", 10, 0, 0.0, 231.0, 165, 302, 235.0, 298.5, 302.0, 302.0, 0.15709191447916176, 0.03528431672871798, 0.1495748209152175], "isController": false}, {"data": ["03_03_Sign In", 10, 0, 0.0, 434.59999999999997, 344, 500, 441.0, 498.0, 500.0, 500.0, 0.15646024345213883, 0.8209578985042401, 0.25592862088118407], "isController": false}, {"data": ["02-Search", 908, 0, 0.0, 231.79185022026405, 144, 1570, 225.0, 275.0, 288.0, 375.90999999999997, 9.812397337252529, 34.790862221865005, 8.846546462322772], "isController": false}, {"data": ["03_06_Add to Cart", 16, 0, 0.0, 211.125, 195, 278, 202.0, 278.0, 278.0, 278.0, 0.6061983784193377, 2.8499167661210882, 0.3935997527847238], "isController": true}, {"data": ["03_03_Sign In-1", 10, 0, 0.0, 202.8, 179, 256, 199.5, 252.10000000000002, 256.0, 256.0, 0.15709931818895906, 0.7890251889119301, 0.10739211204323372], "isController": false}, {"data": ["01_Open_URL", 966, 0, 0.0, 854.7453416149079, 0, 3105, 844.0, 976.3000000000001, 1029.3, 1976.9500000000007, 9.690719581071999, 46.37121550314497, 5.296722250158001], "isController": true}, {"data": ["04_09_Confirm Details", 2, 0, 0.0, 6571.5, 217, 12926, 6571.5, 12926.0, 12926.0, 12926.0, 0.1547269070091289, 0.8180580806127186, 0.09383340747330961], "isController": true}, {"data": ["03_07_Sign Out", 16, 0, 0.0, 392.75, 333, 467, 398.5, 467.0, 467.0, 467.0, 0.35077719071317387, 1.808009777914191, 0.4360735974393265], "isController": true}, {"data": ["01-Open", 941, 0, 0.0, 864.2837407013826, 633, 2114, 847.0, 974.6000000000001, 1022.9, 1801.4400000000007, 9.634286182324516, 47.32596726799902, 5.405778156098984], "isController": false}, {"data": ["04_08_Key in Payment Details", 2, 0, 0.0, 4364.5, 237, 8492, 4364.5, 8492.0, 8492.0, 8492.0, 0.23551577955723035, 1.084660562882713, 0.2955447038389072], "isController": true}, {"data": ["03_02_Click on Sign In", 16, 0, 0.0, 237.74999999999997, 190, 288, 234.5, 287.3, 288.0, 288.0, 0.1852945604465599, 0.7409068142074604, 0.11074245214188931], "isController": true}, {"data": ["03_05_Select Product ID", 16, 0, 0.0, 235.0, 184, 277, 241.5, 277.0, 277.0, 277.0, 0.4953713737267407, 2.005794490541503, 0.32043126335180655], "isController": true}, {"data": ["02_02_Select_Category", 1021, 0, 0.0, 229.01665034280128, 0, 1293, 220.0, 275.0, 295.9, 379.0, 10.710389392413562, 39.93625135060003, 7.025291952521819], "isController": true}, {"data": ["02_03_Select Product ID (Fish)", 499, 0, 0.0, 229.18036072144318, 153, 1012, 223.0, 276.0, 284.0, 386.0, 5.3485106702251946, 21.02130410811709, 3.6884999149222377], "isController": false}, {"data": ["02_Search_URL", 935, 0, 0.0, 231.59251336898393, 0, 2291, 223.0, 275.0, 289.0, 390.67999999999984, 9.829172141918528, 33.84396558804205, 8.605771599868595], "isController": true}, {"data": ["02_03_Select Product ID", 505, 0, 0.0, 228.51287128712903, 0, 1294, 222.0, 276.0, 284.7, 392.58, 5.412125304097139, 21.018600664191023, 3.688025555546625], "isController": true}, {"data": ["04_10_Sign Out", 2, 0, 0.0, 4531.5, 828, 8235, 4531.5, 8235.0, 8235.0, 8235.0, 0.24283632831471588, 1.251650528169014, 0.29761678909664885], "isController": true}, {"data": ["04_03_Sign in -1", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 27.002478158602152, 3.6752352150537635], "isController": false}, {"data": ["02_04_Select Item ID (Fish)", 989, 0, 0.0, 227.04651162790717, 0, 1354, 220.0, 273.0, 287.0, 371.0, 10.626524406623043, 39.238675572693374, 6.756873596471435], "isController": true}, {"data": ["04_03_Sign in -0", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.0209517045454546, 4.327947443181818], "isController": false}, {"data": ["02_01_Enter Store", 1036, 0, 0.0, 845.7007722007726, 0, 2367, 830.0, 960.3000000000001, 1000.0, 1606.0, 10.465492160982706, 51.17822020971391, 5.870729689646637], "isController": true}, {"data": ["03-04_View Categories", 17, 0, 0.0, 208.47058823529412, 0, 265, 220.0, 265.0, 265.0, 265.0, 0.2860796984383414, 1.026192594742865, 0.16584997223344103], "isController": true}, {"data": ["04_10_Sign Out-1", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 24.52580845771144, 3.02685789800995], "isController": false}, {"data": ["04-04_View Categories", 2, 0, 0.0, 3159.5, 256, 6063, 3159.5, 6063.0, 6063.0, 6063.0, 0.32986970146792016, 1.2250922604321293, 0.2032693179943922], "isController": true}, {"data": ["04_02_Click on Sign In", 3, 0, 0.0, 134.0, 0, 201, 201.0, 201.0, 201.0, 201.0, 0.046342782111686104, 0.12355058121572565, 0.018464702247624934], "isController": true}, {"data": ["04_10_Sign Out-0", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.35880091853035145, 0.9859225239616614], "isController": false}, {"data": ["04_01_Open URL", 4, 0, 0.0, 843.0, 788, 898, 843.0, 898.0, 898.0, 898.0, 0.06104167620442858, 0.31704116688794276, 0.03287547307299059], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4090, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
