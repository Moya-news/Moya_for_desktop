import React, {useEffect, useState} from "react";
import { DisclosureFilterWrapper, SetPeriod, SetType } from "./style";
import DisclosureModal from "@components/disclosure/DisclosureModal";
// import { func } from "prop-types";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useMediaQuery } from 'react-responsive'

const DomesticFilter = ({ 
  setDisclosureList, 
  disclosureList, 
  setUrlParams, 
  urlParams 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [period, setPeriod] = useState("oneY");
  const [isTypeChecked, setIsTypeChecked] = useState({
    "A": true,
    "B": false,
    "C": false,
    "D": false,
    "E": false,
    "F": false,
    "G": false,
    "H": false,
    "I": false,
    "J": false
  })
  
  const openModal = (e) => {
    e.preventDefault()
    setModalVisible(true)
  }
  const closeModal = () => setModalVisible(false)

  // Date function
  const date = {
    today: new Date(),
    oneM: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    threeM: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    sixM: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    oneY: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    threeY: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
    fiveY: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
    tenY: new Date(new Date().setFullYear(new Date().getFullYear() - 10))
  }
  const getToday = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
  }

  // Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault()
    closeModal()

    let submitResult = {};

    const checkedTypes = [...form.type].filter(input => input.checked)
    
    let checkedTypeDetails = [];

    checkedTypes.forEach(type => {
      const result = [...form[`type${type.value}`]]
        .filter(li => li.name === `type${type.value}` && li.checked)
        .map(li => li.value)

      checkedTypeDetails = [...checkedTypeDetails, ...result]
    })

    submitResult = {
      bgn_de : form.date[0].value.replaceAll("-", ""),
      end_de : form.date[1].value.replaceAll("-", ""),
      pblntf_detail_ty : checkedTypeDetails
    }

    // (API ?????? ??? ??????) ?????? url params ?????? ??? ?????? ??????????????? ?????????
    setUrlParams({...urlParams, ...submitResult})
    setDisclosureList({
      ...disclosureList, 
      list: [...disclosureList.list.sort(() => Math.random() - 0.5)]
    })

    return submitResult;
  }
  const handlePeriodChange = (e) => {
    setPeriod(e.target.id)
    // (API ?????? ??? ??????) ?????? ??????????????? ?????????
    setDisclosureList({
      ...disclosureList, 
      list: [...disclosureList.list.sort(() => Math.random() - 0.5)]
    })
  }
  const handleValueChange = (e) => {
    return ;
  }

  const handleTypeCheck = (e) => {
    if(e.target.checked) {
      setIsTypeChecked({...isTypeChecked, [e.target.value] : true})
    } else {
      setIsTypeChecked({...isTypeChecked, [e.target.value] : false})
    }
  }
  const handleAllDetailCheck = (e) => {
    const checkboxes = document.getElementsByName(e.target.value);
    for(let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = e.target.checked;
    }

  }
  const handleCloseClick = (e) => {
    const targetValue = e.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].value[0]
    setIsTypeChecked({...isTypeChecked, [targetValue] : false})
  }

  const handleResetClick = () => {
    setPeriod('oneY');
    setIsTypeChecked({
      "A": true,
      "B": false,
      "C": false,
      "D": false,
      "E": false,
      "F": false,
      "G": false,
      "H": false,
      "I": false,
      "J": false
    })
  }

  return (
    <DisclosureFilterWrapper>
      <div className="disclosure__filter">
        <form name="form" onSubmit={handleFormSubmit}>
          <SetPeriod key={period}>
            <div className="date__picker">
              {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}className="datepicker"/>~
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}className="datepicker"/> */}
              <input className="begin" type="date" name="date" defaultValue={getToday(date[period])} min={date.sixM} max={date.oneM} onChange={handleValueChange} />
              <span>~</span>
              <input type="date" name="date" defaultValue={getToday(date.today)} min={date.oneM} max={date.oneM} />
            </div>
            <ul className="date__radio">
              <li>                
                <input type="radio" id="oneM" name="period" onChange={handlePeriodChange} checked={period === "oneM"} />
                <label htmlFor="oneM">1??????</label>
              </li>
              <li>
                <input type="radio" id="threeM" name="period" onChange={handlePeriodChange} checked={period === "threeM"} />
                <label htmlFor="threeM">3??????</label>
              </li>
              <li>
                <input type="radio" id="sixM" name="period" onChange={handlePeriodChange} checked={period === "sixM"} />
                <label htmlFor="sixM">6??????</label>
              </li>
              <li>
                <input type="radio" id="oneY" name="period" onChange={handlePeriodChange} checked={period === "oneY"} />
                <label htmlFor="oneY">1???</label>
              </li>
              <li>
                <input type="radio" id="threeY" name="period" onChange={handlePeriodChange} checked={period === "threeY"} />
                <label htmlFor="threeY">3???</label>
              </li>
              <li>
                <input type="radio" id="fiveY" name="period" onChange={handlePeriodChange} checked={period === "fiveY"} />
                <label htmlFor="fiveY">5???</label>
              </li>
              <li>
                <input type="radio" id="tenY" name="period" onChange={handlePeriodChange} checked={period === "tenY"} />
                <label htmlFor="tenY">10???</label>
              </li>
            </ul>
          </SetPeriod>
          <button className="btn__filter" onClick={openModal}>??????</button>
          {
            modalVisible && 
            <DisclosureModal 
              visible={modalVisible} 
              closable={true}
              maskClosable={true} 
              onClose={closeModal}
            >
              <section className="type">
                <h4>????????????</h4>
                <ul>
                  <li>
                    <input 
                      type="checkbox" id="typeA" name="type" value="A" 
                      onChange={handleTypeCheck} checked={isTypeChecked["A"]}
                    />
                    <label htmlFor="typeA">????????????</label>
                  </li> 
                  <li>
                    <input 
                      type="checkbox" id="typeB" name="type" value="B" 
                      onChange={handleTypeCheck} checked={isTypeChecked["B"]}
                    />
                    <label htmlFor="typeB">??????????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeC" name="type" value="C" 
                      onChange={handleTypeCheck} checked={isTypeChecked["C"]}
                    />
                    <label htmlFor="typeC">????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeD" name="type" value="D" 
                      onChange={handleTypeCheck} checked={isTypeChecked["D"]}
                    />
                    <label htmlFor="typeD">????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeE" name="type" value="E" 
                      onChange={handleTypeCheck} checked={isTypeChecked["E"]}
                    />
                    <label htmlFor="typeE">????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeF" name="type" value="F" 
                      onChange={handleTypeCheck} checked={isTypeChecked["F"]}
                    />
                    <label htmlFor="typeF">??????????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeG" name="type" value="G" 
                      onChange={handleTypeCheck} checked={isTypeChecked["G"]}
                    />
                    <label htmlFor="typeG">????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeH" name="type" value="H" 
                      onChange={handleTypeCheck} checked={isTypeChecked["H"]}
                    />
                    <label htmlFor="typeH">???????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeI" name="type" value="I" 
                      onChange={handleTypeCheck} checked={isTypeChecked["I"]}
                    />
                    <label htmlFor="typeI">???????????????</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" id="typeJ" name="type" value="J" 
                      onChange={handleTypeCheck} checked={isTypeChecked["J"]}
                    />
                    <label htmlFor="typeJ">???????????????</label>
                  </li>
                </ul>
              </section>
              <section className="type__details">
                { isTypeChecked["A"] && 
                  <div>
                  <h5>????????????</h5>
                  <ul>
                    <li>
                      <input type="checkbox" id="typeA1" name="typeA" value="A001" />
                      <label htmlFor="typeA1">???????????????</label>
                    </li>                     
                    <li>
                      <input type="checkbox" id="typeA2" name="typeA" value="A002" />
                      <label htmlFor="typeA2">???????????????</label>
                    </li>                    
                    <li>
                      <input type="checkbox" id="typeA3" name="typeA" value="A003" />
                      <label htmlFor="typeA3">???????????????</label>
                    </li>                    
                    <li>
                      <input type="checkbox" id="typeA4" name="typeA" value="A004" />
                      <label htmlFor="typeA4">??????????????????????????????</label>
                    </li>                    
                    <li>
                      <input type="checkbox" id="typeA5" name="typeA" value="A005" />
                      <label htmlFor="typeA5">????????????????????????(??????????????? ??????)</label>
                    </li>                    
                  </ul>
                  <div className="type__details__btn">
                    <input type="checkbox" id="allA" value="typeA" onChange={handleAllDetailCheck}/>
                    <label htmlFor="allA">????????????</label>
                    <button onClick={handleCloseClick}>??????</button>
                  </div>
                  </div> }
                { isTypeChecked["B"] && 
                  <div>
                  <h5>?????????????????????</h5>
                  <ul>
                    <li>
                      <input type="checkbox" id="typeB1" name="typeB" value="B001" />
                      <label htmlFor="typeB1">?????????????????????</label>
                    </li>                    
                    <li>
                      <input type="checkbox" id="typeB2" name="typeB" value="B002" />
                      <label htmlFor="typeB2">????????????????????????(??????????????? ??????)</label>
                    </li>                    
                    <li>
                      <input type="checkbox" id="typeB3" name="typeB" value="B003" />
                      <label htmlFor="typeB3">?????????????????????????????????(??????????????? ??????)</label>
                    </li>                    
                  </ul>
                  <div className="type__details__btn">
                    <input type="checkbox" id="allB" value="typeB" onChange={handleAllDetailCheck}/>
                    <label htmlFor="allB">????????????</label>
                    <button onClick={handleCloseClick}>??????</button>
                  </div>
                  </div> }
                { isTypeChecked["C"] && 
                  <div>
                    <h5>????????????</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeC1" name="typeC" value="C001" />
                        <label htmlFor="typeC1">????????????(????????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeC2" name="typeC" value="C002" />
                        <label htmlFor="typeC2">????????????(????????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeC3" name="typeC" value="C003" />
                        <label htmlFor="typeC3">????????????(??????????????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeC4" name="typeC" value="C004" />
                        <label htmlFor="typeC4">????????????(?????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeC5" name="typeC" value="C005" />
                        <label htmlFor="typeC5">????????????(??????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeC6" name="typeC" value="C006" />
                        <label htmlFor="typeC6">????????????(????????????)</label>
                      </li>
                      <li>
                        <input type="checkbox" id="typeC7" name="typeC" value="C007" />
                        <label htmlFor="typeC7">????????????(????????????)</label>
                      </li>          
                      <li>
                        <input type="checkbox" id="typeC8" name="typeC" value="C008" />
                        <label htmlFor="typeC8">????????????(??????????????????)</label>
                      </li>          
                      <li>
                        <input type="checkbox" id="typeC9" name="typeC" value="C009" />
                        <label htmlFor="typeC9">????????????(?????????)</label>
                      </li>          
                      <li>
                        <input type="checkbox" id="typeC10" name="typeC" value="C010" />
                        <label htmlFor="typeC10">????????????(??????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeC11" name="typeC" value="C011" />
                        <label htmlFor="typeC11">??????????????????????????????????????????</label>
                      </li>                    
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allC" value="typeC" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allC">????????????</label>
                      <button onClick={handleCloseClick}>??????</button>
                    </div>
                  </div> }
                { isTypeChecked["D"] && 
                  <div>
                    <h5>????????????</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeD1" name="typeD" value="D001" />
                        <label htmlFor="typeD1">???????????????????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeD2" name="typeD" value="D002" />
                        <label htmlFor="typeD2">????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeD3" name="typeD" value="D003" />
                        <label htmlFor="typeD3">???????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeD4" name="typeD" value="D004" />
                        <label htmlFor="typeD4">?????????????????????????????????????????????????????????</label>
                      </li>                    
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allD" value="typeD" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allD">????????????</label>
                      <button onClick={handleCloseClick}>??????</button>
                    </div>
                  </div> }
                { isTypeChecked["E"] && 
                  <div>
                    <h5>????????????</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeE1" name="typeE" value="E001" />
                        <label htmlFor="typeE1">??????????????????/??????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE2" name="typeE" value="E002" />
                        <label htmlFor="typeE2">??????????????????/??????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE3" name="typeE" value="E003" />
                        <label htmlFor="typeE3">????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE4" name="typeE" value="E004" />
                        <label htmlFor="typeE4">??????????????????????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE5" name="typeE" value="E005" />
                        <label htmlFor="typeE5">???????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE6" name="typeE" value="E006" />
                        <label htmlFor="typeE6">???????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE7" name="typeE" value="E007" />
                        <label htmlFor="typeE7">????????????/????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE8" name="typeE" value="E008" />
                        <label htmlFor="typeE8">??????????????????(?????????????????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeE9" name="typeE" value="E009" />
                        <label htmlFor="typeE9">???????????????/??????(?????????????????????)</label>
                      </li>                    
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allE" value="typeE" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allE">????????????</label>
                      <button onClick={handleCloseClick}>??????</button>
                    </div>
                  </div> }
                { isTypeChecked["F"] && 
                  <div>
                    <h5>??????????????????</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeF1" name="typeF" value="F001" />
                        <label htmlFor="typeF1">???????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeF2" name="typeF" value="F002" />
                        <label htmlFor="typeF2">?????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeF3" name="typeF" value="F003" />
                        <label htmlFor="typeF3">?????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeF4" name="typeF" value="F004" />
                        <label htmlFor="typeF4">???????????????????????????*</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeF5" name="typeF" value="F005" />
                        <label htmlFor="typeF5">???????????????????????????????????????</label>
                      </li>                                  
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allF" value="typeF" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allF">????????????</label>
                      <button onClick={handleCloseClick}>??????</button>
                    </div>
                  </div> }
                { isTypeChecked["G"] && 
                  <div>
                    <h5>????????????</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeG1" name="typeG" value="G001" />
                        <label htmlFor="typeG1">????????????(??????????????????-?????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeG2" name="typeG" value="G002" />
                        <label htmlFor="typeG2">????????????(??????????????????-?????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeG3" name="typeG" value="G003" />
                        <label htmlFor="typeG3">????????????(??????????????????-??????)</label>
                      </li>                                        
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allG" value="typeG" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allG">????????????</label>
                      <button onClick={handleCloseClick}>??????</button>
                    </div>
                  </div> }
                { isTypeChecked["H"] && 
                  <div>
                    <h5>???????????????</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeH1" name="typeH" value="H001" />
                        <label htmlFor="typeH1">?????????????????????/????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeH2" name="typeH" value="H002" />
                        <label htmlFor="typeH2">??????/??????/???????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeH3" name="typeH" value="H003" />
                        <label htmlFor="typeH3">????????????(???????????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeH4" name="typeH" value="H004" />
                        <label htmlFor="typeH4">?????????????????????/????????????*</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeH5" name="typeH" value="H005" />
                        <label htmlFor="typeH5">????????????????????????????????????????????????</label>
                      </li>                                  
                      <li>
                        <input type="checkbox" id="typeH6" name="typeH" value="H006" />
                        <label htmlFor="typeH6">?????????????????????</label>
                      </li>                                  
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allH" value="typeH" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allH">????????????</label>
                      <button onClick={handleCloseClick}>??????</button>
                    </div>
                  </div> }
                { isTypeChecked["I"] && 
                  <div>
                    <h5>???????????????(??????????????? ??????)</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeI1" name="typeI" value="I001" />
                        <label htmlFor="typeI1">????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeI2" name="typeI" value="I001" />
                        <label htmlFor="typeI2">????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeI3" name="typeI" value="I001" />
                        <label htmlFor="typeI3">????????????/??????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeI4" name="typeI" value="I001" />
                        <label htmlFor="typeI4">????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeI5" name="typeI" value="I001" />
                        <label htmlFor="typeI5">??????????????????</label>
                      </li>                                  
                      <li>
                        <input type="checkbox" id="typeI6" name="typeI" value="I001" />
                        <label htmlFor="typeI6">????????????</label>
                      </li>                                  
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allI" value="typeI" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allI">????????????</label>
                      <button onClick={handleCloseClick}>??????</button>
                    </div>
                  </div> }
                { isTypeChecked["J"] && 
                  <div>
                    <h5>??????????????? (????????????????????? ??????)</h5>
                    <ul>
                      <li>
                        <input type="checkbox" id="typeJ1" name="typeJ" value="J001" />
                        <label htmlFor="typeJ1">???????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeJ2" name="typeJ" value="J002" />
                        <label htmlFor="typeJ2">???????????????????????????(???????????????)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeJ3" name="typeJ" value="J003" />
                        <label htmlFor="typeJ3">???????????????????????????(???)</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeJ4" name="typeJ" value="J004" />
                        <label htmlFor="typeJ4">????????????????????????</label>
                      </li>                    
                      <li>
                        <input type="checkbox" id="typeJ5" name="typeJ" value="J005" />
                        <label htmlFor="typeJ5">?????????????????????????????????</label>
                      </li>                                  
                      <li>
                        <input type="checkbox" id="typeJ6" name="typeJ" value="J006" />
                        <label htmlFor="typeJ6">?????????????????????</label>
                      </li>                                  
                    </ul>
                    <div className="type__details__btn">
                      <input type="checkbox" id="allJ" value="typeJ" onChange={handleAllDetailCheck}/>
                      <label htmlFor="allJ">????????????</label>
                      <button onClose={closeModal}>??????</button>
                    </div>
                  </div> }
              </section>
              <div className="type__btn">
                <input className="btn__form" type="reset" value="?????????" onClick={handleResetClick} />
                <button className="btn__submit" type="submit">??????</button>
              </div>
            </DisclosureModal>
          }
        </form>
      </div>
    </DisclosureFilterWrapper>
  )
}

export default DomesticFilter;