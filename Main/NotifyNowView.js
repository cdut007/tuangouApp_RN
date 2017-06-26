import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    ListView,
    Picker,
    TextInput
} from 'react-native';

import NavBar from '../common/NavBar'
import CheckBox from 'react-native-checkbox'
import ModalDropdown from 'react-native-modal-dropdown';
import Dimensions from 'Dimensions';

var width = Dimensions.get('window').width;

let numberList1 = [
    '无',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',]

var dataSourceList = [
    {
        'number': 'e1',
        'phone': '13980000',
    }
]

export default class NotifyNowView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            check_message: true,
            check_call: true,
            check_number: true,
            select_number1: '无',
            select_number2: '0',
            templateText: 'aaasdfasdsa,dafda,fdafd,dsafdsafdsafdsafdsa,,ffda,',
            dataSource: ds.cloneWithRows(dataSourceList)
        }
    }


    back() {
        this.props.navigator.pop()
    }

    onSelectDropDown1(idx, value) {
        this.setState({ select_number1: value })
    }

    onSelectDropDown2(idx, value) {
        this.setState({ select_number2: value })
    }

    onTemplatePress() {

    }

    onSend() {

    }

    onNumberAdd(rowData) {

    }

    onNumberMinus(rowData) {

    }

    onDeleteCell(rowData) {
        console.log('~~~~~' + JSON.stringify(rowData))
    }

    onPhoneInputChange(text)
    {

    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="通知取件"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                {this.renderCheckBox()}
                {this.renderNumberView()}
                {this.renderTemplateView()}
                {this.renderListView()}

            </View>
        )
    }

    renderCheckBox() {
        return (
            <View style={styles.checkBoxView}>
                <CheckBox
                    label='短信'
                    checkedImage={require('../images/chooseClick.png')}
                    uncheckedImage={require('../images/choose.png')}
                    checked={this.state.check_message}
                    onChange={(checked) => { this.setState({ check_message: !checked }) }}
                />
                <CheckBox
                    label='电话'
                    checkedImage={require('../images/chooseClick.png')}
                    uncheckedImage={require('../images/choose.png')}
                    checked={this.state.check_call}
                    onChange={(checked) => { this.setState({ check_call: !checked }) }}
                />
                <CheckBox
                    label='编号'
                    checkedImage={require('../images/chooseClick.png')}
                    uncheckedImage={require('../images/choose.png')}
                    checked={this.state.check_number}
                    onChange={(checked) => { this.setState({ check_number: !checked }) }}
                />
            </View>)
    }

    renderNumberView() {
        if (!this.state.check_number) {
            return (<View />)
        }

        let numberList2 = []
        for (var i = 1; i <= 999; i++) {
            numberList2.push(i.toString())
        }
        return (
            <View style={styles.dropDownView}>
                <Text style={{ marginRight: 10 }}>自动编号：</Text>
                <ModalDropdown
                    options={numberList1}
                    textStyle={{ alignSelf: 'stretch' }}
                    dropdownStyle={styles.dropDownList}
                    style={styles.dropDown}
                    defaultValue={this.state.select_number1}
                    onSelect={(idx, value) => this.onSelectDropDown1(idx, value)} >
                    {/*<Image source={require('../images/numBtn.png')} style={{width: 20, height: 36, alignSelf: 'flex-end'}}/>*/}
                </ModalDropdown>
                <TextInput
                    maxLength={3}
                    style={styles.numberText}
                    keyboardType={'numeric'}
                    defaultValue={this.state.select_number2}
                    onChangeText={(text) => this.setState({ select_number2: text })} />
            </View>
        )
    }

    renderTemplateView() {
        return (
            <View style={styles.templateView}>
                <TouchableOpacity onPress={this.onTemplatePress.bind(this)}
                    style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ margin: 10 }} >
                        {this.state.templateText}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onSend.bind(this)}
                    style={{ width: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: '#75bb17' }}>
                    <Text style={{ color: 'white', }} >
                        发送
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderRow(rowData, sectionID, rowID) {
        numberView = () => {
            if (rowData.number) {
                return (
                    <View style={{ width: 100, height: 30, borderWidth: 0.5, borderColor: 'gray', borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={this.onNumberAdd.bind(this, rowData)}
                            style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#1a8eaf' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#858585', flex: 1, textAlign: 'center', backgroundColor: '#f5f5f5' }}>{rowData.number}</Text>
                        <TouchableOpacity onPress={this.onNumberMinus.bind(this, rowData)}
                            style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#1a8eaf' }}>+</Text>
                        </TouchableOpacity>
                    </View>

                )
            }
            else {
                return (<View />)
            }
        }
        return (
            <View style={styles.itemView}>
                <Text style={{ marginLeft: 10 }}>{rowData.phone}</Text>
                {numberView()}
                <TouchableOpacity onPress={this.onDeleteCell.bind(this, rowData)}
                    style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Image source={require('../images/delete_btn.png')} />
                </TouchableOpacity>
            </View>
        )
    }
    renderListView() {
        dataSourceList.rem
        return (
            <ListView
                style={{ marginTop: 10 }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        )
    }

    renderPhoneInputView() {
        <View>
            <TextInput
                maxLength={3}
                style={styles.numberText}
                keyboardType={'phone-pad'}
                placeholder={'输入手机号'}
                onChangeText={(text) => this.setState({ select_number2: text })} />
        </View>
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    checkBoxView: {
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        height: 50,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    dropDownView: {
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        paddingRight: 20,
        height: 50,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap",
        borderColor: 'gray',
        borderWidth: 0.5
    },
    numberText: {
        alignSelf: 'center',
        paddingLeft: 10,
        width: 90,
        height: 36,
        borderColor: '#0a6984',
        borderWidth: 1,
        borderRadius: 6,
    },
    dropDown: {
        justifyContent: 'center',
        width: 90,
        height: 36,
        marginRight: 20,
        borderColor: '#0a6984',
        borderWidth: 1,
        borderRadius: 6,
    },
    dropDownList: {
        width: 90,
        borderColor: '#0a6984',
        borderWidth: 1,
    },
    templateView:
    {
        flexDirection: "row",
        height: 80,
        backgroundColor: 'white'
    },
    itemView:
    {
        alignSelf: 'stretch',
        // justifyContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        width: width,
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        backgroundColor: 'white'
    }
})
