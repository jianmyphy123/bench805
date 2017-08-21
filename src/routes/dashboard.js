import express from 'express';
const router = express.Router();
import { ensureAuthenticated } from '../common/authGuard';
import { fetchTableData } from '../models/upload';


router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard/index', { title: 'Result' });
});


router.post('/', (req, res) => {

  let reqdata = req.body;console.log(reqdata);

  //Calculates Goodwill and Contingenet Consideration, Inventory, PPA
  let Intangible, KeyWord, Industry, Industry1, Industry2, Discr;
  let GW_PC, GW_NA, GW_NANC, GW_EC, GW_INV, GW_PPE;
  let i, k, j = new Array(4), CC, GW, INV, PPE;
  let sheet = {}, sheetMAIN, sheetTEST;
  let EC;




  Industry = 'Hello';

  if(reqdata.industries) {
    Industry1 = reqdata.industries[0];
    Industry2 = reqdata.industries[1];
  }



  fetchTableData((results) => {

    // Caculations Procedure

    sheetMAIN = results;

    k = 0; //k: 0 = Contingent Consideration, 1 - Goodwill, 2 - Inventory, 3 - PPE

    for(k=0; k<=3; k++) {

      GW_PC = []; GW_NA = []; GW_NANC = []; GW_EC = []; GW_INV = []; GW_PPE = [];

      i = 0;
      GW = 0;
      CC = 0;
      INV = 0;
      PPE = 0;

      //j(): 1-PC, 2-net assets, 3-net assets net cash, 4-excess consideration
      while(Industry != undefined) {

        Industry = Cells(sheetMAIN, 3 + i, 6);
        Discr = Cells(sheetMAIN, 3 + i, 8);

        //this if-statement to count total industr observations
        if(Industry == Industry1 || Industry == Industry2) {
          if(Cells(sheetMAIN, 3 + i, 13) != 'na' && Cells(sheetMAIN, 3 + i, 18) != 0)
            GW++;
          if(Cells(sheetMAIN, 3 + i, 12) != 'na')
            CC++;
          if(Cells(sheetMAIN, 3 + i, 14) != 'na')
            INV++;
          if(Cells(sheetMAIN, 3 + i, 15) != 'na')
            PPE++;
        }

        //starting main goodwill and contingent consideration stat calculations
        if(RightTrans(reqdata, sheetMAIN, Industry, Discr, i + 3) == 1) {

          if(Cells(sheetMAIN, 3 + i, 13) == 'na')
            EC = 0;
          else
            EC = Number(Cells(sheetMAIN, 3 + i, 13)) + Number(Cells(sheetMAIN, 3 + i, 18)) + Number(Cells(sheetMAIN, 3 + i, 22)) + Number(Cells(sheetMAIN, 3 + i, 26)) + Number(Cells(sheetMAIN, 3 + i, 30)) + Number(Cells(sheetMAIN, 3 + i, 34)) + Number(Cells(sheetMAIN, 3 + i, 38));

          if(Cells(sheetMAIN, 3 + i, 12 + k) == "na" || Cells(sheetMAIN, 3 + i, 12 + k) == 0 || EC == 0 || EC == Cells(sheetMAIN, 3 + i, 13))
            GW_EC.push("Empty");
          else
              GW_EC.push(Number(Cells(sheetMAIN, 3 + i, 12 + k)) / EC);

          if(Cells(sheetMAIN, 3 + i, 9) == "na" || Cells(sheetMAIN, 3 + i, 12 + k) == "na" || Cells(sheetMAIN, 3 + i, 12 + k) == 0)
              GW_PC.push("Empty");
          else
              GW_PC.push(Number(Cells(sheetMAIN, 3 + i, 12 + k)) / Number(Cells(sheetMAIN, 3 + i, 9)));

          if(Cells(sheetMAIN, 3 + i, 10) == "na" || Cells(sheetMAIN, 3 + i, 12 + k) == "na" || Cells(sheetMAIN, 3 + i, 12 + k) == 0)
              GW_NA.push("Empty");
          else
              GW_NA.push(Number(Cells(sheetMAIN, 3 + i, 12 + k)) / Number(Cells(sheetMAIN, 3 + i, 10)));

          if(Cells(sheetMAIN, 3 + i, 11) == "na" || Cells(sheetMAIN, 3 + i, 12 + k) == "na" || Cells(sheetMAIN, 3 + i, 12 + k) == 0)
              GW_NANC.push("Empty");
          else
              GW_NANC.push(Number(Cells(sheetMAIN, 3 + i, 12 + k)) / Number(Cells(sheetMAIN, 3 + i, 11)));

        }

        i++;

      }

      if(k <= 1) {

        sheet[(15 + 2 * k) + '_' + 4] = median(GW_PC);
        sheet[(15 + 2 * k) + '_' + 5] = median(GW_NA);
        sheet[(15 + 2 * k) + '_' + 6] = median(GW_NANC);
        sheet[(15 + 2 * k) + '_' + 7] = median(GW_EC);

        sheet[(15 + 2 * k) + '_' + 9] = stDev(GW_PC);
        sheet[(15 + 2 * k) + '_' + 10] = stDev(GW_NA);
        sheet[(15 + 2 * k) + '_' + 11] = stDev(GW_NANC);
        sheet[(15 + 2 * k) + '_' + 12] = stDev(GW_EC);

        sheet[(15 + 2 * k) + '_' + 14] = count(GW_PC);
        sheet[(15 + 2 * k) + '_' + 15] = count(GW_NA);
        sheet[(15 + 2 * k) + '_' + 16] = count(GW_NANC);
        sheet[(15 + 2 * k) + '_' + 17] = count(GW_EC);

        sheet[15+ '_' +18] = CC;
        sheet[17+ '_' +18] = GW;
        sheet[26+ '_' +18] = INV;
        sheet[27+ '_' +18] = PPE;

      } else {

        sheet[(24 + k) + '_' + 4] = median(GW_PC);
        sheet[(24 + k) + '_' + 5] = median(GW_NA);
        sheet[(24 + k) + '_' + 6] = median(GW_NANC);
        sheet[(24 + k) + '_' + 7] = median(GW_EC);

        sheet[(24 + k) + '_' + 9] = stDev(GW_PC);
        sheet[(24 + k) + '_' + 10] = stDev(GW_NA);
        sheet[(24 + k) + '_' + 11] = stDev(GW_NANC);
        sheet[(24 + k) + '_' + 12] = stDev(GW_EC);

        sheet[(24 + k) + '_' + 14] = count(GW_PC);
        sheet[(24 + k) + '_' + 15] = count(GW_NA);
        sheet[(24 + k) + '_' + 16] = count(GW_NANC);
        sheet[(24 + k) + '_' + 17] = count(GW_EC);

      }

      Industry = 'Hello';

    }


    // Drill Procedure
    sheet[18+'_'+2] = 'Developed Technology';
    sheet[19+'_'+2] = 'In-Process R&D';
    sheet[20+'_'+2] = 'Customer Relationships';
    sheet[21+'_'+2] = 'Trade Name';
    sheet[22+'_'+2] = 'Backlog';
    sheet[23+'_'+2] = 'Non-Compete Agreement';
    sheet[24+'_'+2] = 'NA';

    let Asset, Asset1;
    let Int_Amount, Int_AmountLF, Life;
    let Asset_All = {}, Asset_PC = [], Asset_NA = [], Asset_NANC = [], Asset_EC = [], UsLife = [];
    let l, A, UsLifeIND, IndCount;

    Industry = "Hello";
    A = 0;
    Asset = sheetCells(sheet, 18 + A, 2);

    while(Asset != undefined) {

      Asset_All = {}; Asset_PC = []; Asset_NA = []; Asset_NANC = []; Asset_EC = []; UsLife = [];

      i = 0;
      j = 0;
      k = 0;
      UsLifeIND = 0;
      IndCount = 0;

      while(Industry != undefined) {

        Industry = Cells(sheetMAIN, 3 + i, 6);
        Discr = Cells(sheetMAIN, 3 + i, 8);

      //counting total industry observations
        if(Industry == Industry1 || Industry == Industry2) {

          if((Cells(sheetMAIN, 3 + i, 17) == Asset) || (Cells(sheetMAIN, 3 + i, 21) == Asset) || (Cells(sheetMAIN, 3 + i, 25) == Asset) || (Cells(sheetMAIN, 3 + i, 29) == Asset) || (Cells(sheetMAIN, 3 + i, 33) == Asset) || (Cells(sheetMAIN, 3 + i, 37) == Asset) )
            IndCount++;

        }

      //main stat calculations of Prototype tab
        if(RightTrans(reqdata, sheetMAIN, Industry, Discr, i + 3) == 1) {

        // calculation useful lives
          Int_Amount = 0;
          Int_AmountLF = 0;
          Life = 0;

          for(l=0; l<=5; l++) {

            Asset1 = Cells(sheetMAIN, 3 + i, 17 + 4 * l);
            //'adding intangible values'
            if(Asset1 == Asset && Cells(sheetMAIN, 3 + i, 18 + 4 * l) != 'na')
              Int_Amount += Number(Cells(sheetMAIN, 3 + i, 18 + 4 * l));

            //'counting indefinete lived assets'
            if(Asset1 == Asset && Cells(sheetMAIN, 3 + i, 18 + 4 * l + 1) == 'Indefinite')
              UsLifeIND++; // infinite useful life counter

            //adding intangibles that have lives
            if(Asset1 == Asset && Cells(sheetMAIN, 3 + i, 18 + 4 * l + 1) != 'na' && Cells(sheetMAIN, 3 + i, 18 + 4 * l + 1) != 'Indefinite') {
              Int_AmountLF += Number(Cells(sheetMAIN, 3 + i, 18 + 4 * l));
              Life += (Number(Cells(sheetMAIN, 3 + i, 18 + 4 * l + 1)) * Number(Cells(sheetMAIN, 3 + i, 18 + 4 * l)));
            }

          }

        // populating useful lives that are finite
          if(Int_AmountLF > 0 && Life > 0) {
            UsLife.push(Life / Int_AmountLF);
          }
        // calculating percentages
        // k 0-PC, 1-net assets, 2-net assets net cash, 3-excess consideration
          for(k=0; k<=3; k++) {

            if(Int_Amount == 0) {
              Asset_All[j+'_'+k] = 'Empty';
              break;
            } else {
              if(k==3) {
                if(Cells(sheetMAIN, 3 + i, 13) == 'na')
                  Asset_All[j+'_'+k] = 'Empty';
                else {
                  let Demon = Number(Cells(sheetMAIN, 3 + i, 13)) + Number(Cells(sheetMAIN, 3 + i, 18)) + Number(Cells(sheetMAIN, 3 + i, 22)) + Number(Cells(sheetMAIN, 3 + i, 26)) + Number(Cells(sheetMAIN, 3 + i, 30)) + Number(Cells(sheetMAIN, 3 + i, 34)) + Number(Cells(sheetMAIN, 3 + i, 38));
                  Asset_All[j+'_'+k] = Int_Amount / Demon;
                }
              } else {
                if(Cells(sheetMAIN, 3 + i, 9 + k) != 'na') {
                  let Demon = Cells(sheetMAIN, 3 + i, 9 + k);
                  Asset_All[j+'_'+k] = Int_Amount / Demon;
                }
              }
            }

            j++;

          }
        }

        i++;

      }

      for(let key in Asset_All) {

          let keyArr = key.split('_');
          switch(keyArr[1]) {
            case '0':
              Asset_PC.push(Asset_All[key]);
              break;
            case '1':
              Asset_NA.push(Asset_All[key]);
              break;
            case '2':
              Asset_NANC.push(Asset_All[key]);
              break;
            case '3':
              Asset_EC.push(Asset_All[key]);
              break;
          }

      }

      sheet[(18 + A) + '_' + 4]    = median(Asset_PC);
      sheet[(18 + A) + '_' + 9]    = stDev(Asset_PC);
      sheet[(18 + A) + '_' + 14]   = count(Asset_PC);

      sheet[(18 + A) + '_' + 5]    = median(Asset_NA);
      sheet[(18 + A) + '_' + 10]   = stDev(Asset_NA);
      sheet[(18 + A) + '_' + 15]   = count(Asset_NA);

      sheet[(18 + A) + '_' + 6]    = median(Asset_NANC);
      sheet[(18 + A) + '_' + 11]   = stDev(Asset_NANC);
      sheet[(18 + A) + '_' + 16]   = count(Asset_NANC);

      sheet[(18 + A) + '_' + 7]    = median(Asset_EC);
      sheet[(18 + A) + '_' + 12]   = stDev(Asset_EC);
      sheet[(18 + A) + '_' + 17]   = count(Asset_EC);

      sheet[(18 + A) + '_' + 18]   = IndCount;

      sheet[(18 + A) + '_' + 20]   = 'na';
      sheet[(18 + A) + '_' + 21]   = 'na';
      sheet[(18 + A) + '_' + 22]   = 'na';
      sheet[(18 + A) + '_' + 23]   = 'na';

      if(count(UsLife) > 0) {
        sheet[(18 + A) + '_' + 20] = median(UsLife);
        sheet[(18 + A) + '_' + 21] = stDev(UsLife);
        sheet[(18 + A) + '_' + 22] = count(UsLife);
      }

      if(UsLifeIND > 0)
        sheet[(18 + A) + '_' + 23] = UsLifeIND;

      Industry = 'Hello';
      IndCount = 0;
      j = 0;

      A++;
      Asset = sheetCells(sheet, 18 + A, 2);

    }

    for(let key in sheet) {
      if(isNaN(sheet[key]))
        continue;

      switch(key) {
        case '15_4':
        case '15_5':
        case '15_6':
        case '15_7':
        case '15_9':
        case '15_10':
        case '15_11':
        case '15_12':

        case '17_4':
        case '17_5':
        case '17_6':
        case '17_7':
        case '17_9':
        case '17_10':
        case '17_11':
        case '17_12':

        case '18_4':
        case '18_5':
        case '18_6':
        case '18_7':
        case '18_9':
        case '18_10':
        case '18_11':
        case '18_12':

        case '19_4':
        case '19_5':
        case '19_6':
        case '19_7':
        case '19_9':
        case '19_10':
        case '19_11':
        case '19_12':

        case '20_4':
        case '20_5':
        case '20_6':
        case '20_7':
        case '20_9':
        case '20_10':
        case '20_11':
        case '20_12':

        case '21_4':
        case '21_5':
        case '21_6':
        case '21_7':
        case '21_9':
        case '21_10':
        case '21_11':
        case '21_12':

        case '22_4':
        case '22_5':
        case '22_6':
        case '22_7':
        case '22_9':
        case '22_10':
        case '22_11':
        case '22_12':

        case '23_4':
        case '23_5':
        case '23_6':
        case '23_7':
        case '23_9':
        case '23_10':
        case '23_11':
        case '23_12':

        case '24_4':
        case '24_5':
        case '24_6':
        case '24_7':
        case '24_9':
        case '24_10':
        case '24_11':
        case '24_12':

        case '26_4':
        case '26_5':
        case '26_6':
        case '26_9':
        case '26_10':
        case '26_11':
        case '26_12':

        case '27_4':
        case '27_5':
        case '27_6':
        case '27_9':
        case '27_10':
        case '27_11':
        case '27_12':
          sheet[key] = Math.round(sheet[key] * 100) + '%';
          break;

        case '26_7':
        case '27_7':
          sheet[key] = Math.round(sheet[key] * 100)/100 + 'x';
          break;

        case '18_20':
        case '18_21':
        case '18_22':
        case '18_23':

        case '19_20':
        case '19_21':
        case '19_22':
        case '19_23':

        case '20_20':
        case '20_21':
        case '20_22':
        case '20_23':

        case '21_20':
        case '21_21':
        case '21_22':
        case '21_23':

        case '22_20':
        case '22_21':
        case '22_22':
        case '22_23':

        case '21_20':
        case '21_21':
        case '21_22':
        case '21_23':

        case '22_20':
        case '22_21':
        case '22_22':
        case '22_23':

        case '23_20':
        case '23_21':
        case '23_22':
        case '23_23':

        case '24_20':
        case '24_21':
        case '24_22':
        case '24_23':
          sheet[key] = Math.round(sheet[key] * 10)/10;
          break;
      }
    }

    res.render('dashboard/index', { title: 'Result', tabledata: sheet, checkedids: reqdata.checkedids, keyword1: reqdata.keyword[0], keyword2: reqdata.keyword[1] });

  });











});

const Cells = (data, i, j) => {
  if(data[i-1] != undefined)
    return data[i-1]["col"+j];
  else
    return undefined;
}

const sheetCells = (data, i, j) => {
  return data[i+'_'+j];
}

const median = (values) => {

  let filteredvalues = [], retval;

  for(let i=0; i<values.length; i++) {
    if(isNaN(values[i]))
      continue;
    filteredvalues.push(values[i]);
  }

  if(filteredvalues.length == 0)
    return 'na';



  filteredvalues.sort( (a,b) => {return a - b;} );

  var half = Math.floor(filteredvalues.length/2);

  if(filteredvalues.length % 2)
      retval = filteredvalues[half];
  else
      retval = (filteredvalues[half-1] + filteredvalues[half]) / 2.0;
  if(isNaN(retval))
    retval = 'na';

  return retval;
}

const stDev = (values) => {
  let numbersArr = [];

  for(let i=0; i<values.length; i++) {
    if(isNaN(values[i]))
      continue;
    numbersArr.push(values[i]);
  }

  if(numbersArr.length == 0)
    return 'na';

  var total = 0;
  for(var key in numbersArr)
     total += parseFloat(numbersArr[key]);
  var meanVal = total / numbersArr.length;
  //--CALCULATE AVAREGE--

  //--CALCULATE STANDARD DEVIATION--
  var SDprep = 0;
  for(var key in numbersArr)
     SDprep += Math.pow((parseFloat(numbersArr[key]) - meanVal),2);
  var SDresult = Math.sqrt(SDprep/(numbersArr.length-1));

  if(isNaN(SDresult))
    return 'na';

  return SDresult;

}

const count = (values) => {
  let numbersArr = [];

  for(let i=0; i<values.length; i++) {
    if(isNaN(values[i]))
      continue;
    numbersArr.push(values[i]);
  }

  return numbersArr.length;
}

const RightTrans = (reqdata, sheet, Industry, Discr, i) => {

  let retRightTrans;

  let A, B1, B2, C, D, j;

  let Industry1, Industry2, Industry3, KeyWord1, KeyWord2, Intangible1, Intangible2, IntangibleX;

  if(reqdata.industries) {
    Industry1 = reqdata.industries[0];
    Industry2 = reqdata.industries[1];
    Industry3 = reqdata.industries[2];
  }
  if(reqdata.keyword) {
    KeyWord1 = reqdata.keyword[0];
    KeyWord2 = reqdata.keyword[1];
  }
  if(reqdata.include) {
    Intangible1 = reqdata.include[0];
    Intangible2 = reqdata.include[1];
  }
  if(reqdata.exclude) {
    IntangibleX = reqdata.exclude[0];
  }

  retRightTrans = 0;

  A = 0;
  B1 = 0;
  B2 = 0;
  C = 0;
  D = 1;

  //checking industry
  if(Industry == Industry1 || Industry == Industry2 || Industry == Industry3)
    A = 1;
  if(Industry1 == "ALL" || Industry2 == "ALL" || Industry3 == "ALL")
    A = 1;

  //checking keyword / one keyword
  if(KeyWord1 != 'NA' && KeyWord1 != '')
    C = Discr == undefined ? 0 : Discr.indexOf(KeyWord1) + 1;
  if(KeyWord2 != 'NA' && KeyWord2 != '')
    C = Discr == undefined ? 0 : C + Discr.indexOf(KeyWord2) + 1;
  if((KeyWord1 == 'NA' || KeyWord1 == '') && (KeyWord2 == 'NA' || KeyWord2 == ''))
    C = 1;

  //checking intangible to include
  if((Intangible1 != 'NA' && Intangible1 != undefined ) || (Intangible2 != 'NA' && Intangible2 != undefined )) {
    for(j=0; j<=5; j++) {
      if(Cells(sheet, i, 17 + j * 4) == Intangible1)
        B1++;
      if(Cells(sheet, i, 17 + j * 4) == Intangible2)
        B2++;
      if(Intangible1 == 'NA' || Intangible1 == undefined)
        B1 = 1;
      if(Intangible2 == 'NA' || Intangible2 == undefined)
        B2 = 1;
    }
  } else {
    B1 = 1;
    B2 = 1;
  }

  //checking intangible tp exclude
  if(IntangibleX != "NA" && IntangibleX != undefined) {
    for(j=0; j<=5; j++)
      if(Cells(sheet, i, 17 + j * 4) == IntangibleX)
        D = 0;
  } else
    D = 1;

  if(A * B1 * B2 * C * D > 0)
    retRightTrans = 1;

  return retRightTrans;
}

export default router;
