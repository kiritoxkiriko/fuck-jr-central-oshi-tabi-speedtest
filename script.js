// ==UserScript==
// @name         fuck-jr-central-oshi-tabi-speedtest
// @namespace    https://github.com/kiritokxiriko/fuck-jr-central-oshi-tabi-speedtest
// @version      0.1
// @description  去他妈的JR东日本 推し旅 活动测速
// @author       kiritoxkiriko
// @match        https://oshi-tabi.voistock.com/*
// @match        https://recommend.jr-central.co.jp/oshi-tabi/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义随机经纬度的范围（东京地区）
    const min_lat = 35.587427290289, max_lat = 35.683863334565;
    const min_lon = 139.71499666664, max_lon = 139.77174806304;
    // 设置模拟速度为250km/h，转换为米每秒（约69.44 m/s）
    const speed = 250 * 1000 / 3600;

    // 生成一个范围内的随机经纬度点
    function randomPosition() {
        return {
            latitude: Math.random() * (max_lat - min_lat) + min_lat,  // 随机纬度
            longitude: Math.random() * (max_lon - min_lon) + min_lon, // 随机经度
            accuracy: 10,            // 精度设为10米
            altitude: null,          // 无高度信息
            altitudeAccuracy: null,  // 无高度精度信息
            heading: null,           // 无航向信息
            speed: speed             // 模拟速度，单位m/s
        };
    }

    // 生成符合地理定位API格式的Position对象
    function createPosition() {
        return {
            coords: randomPosition(),    // 随机生成的坐标
            timestamp: Date.now()        // 当前时间戳
        };
    }

    // 重写navigator.geolocation.watchPosition，返回模拟的定位数据
    navigator.geolocation.watchPosition = function(success, error, options) {
        // 立即调用一次成功回调，返回模拟位置
        success(createPosition());

        // 每2秒调用一次成功回调，返回新的随机位置
        const interval = setInterval(() => {
            success(createPosition());
        }, 2000);

        // 返回interval的ID作为watchId
        return interval;
    };

    // 重写navigator.geolocation.clearWatch，清除定时器
    navigator.geolocation.clearWatch = function(watchId) {
        clearInterval(watchId);
    };

    // 可选：同理可以重写getCurrentPosition方法
    // navigator.geolocation.getCurrentPosition = function(success, error, options) {
    //     success(createPosition());
    // };
})();