<?php
    //menghubungkan project dengan database
    $host = 'localhost';
    $username = 'root';
    $password = '';
    $database = 'ppb_rpl3_db';

    $konek = new mysqli($host, $username, $password, $database);

    // if (!$konek) {
    //     echo 'tidak terbuhung server';
    // } else {
    //     echo 'terhubung';
    // }
?>