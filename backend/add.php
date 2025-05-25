<?php
    include 'database.php';

    //mengubah string json ke object php
    $data = json_decode(file_get_contents('php://input'));

    if (isset($data->nama) && isset($data->hobi) && isset($data->catatan)) {
        $nama = $data->nama;
        $hobi = $data->hobi;
        $catatan = $data->catatan;

        $sql = "INSERT INTO catatan (nama, hobi_ku, catatanku) VALUES ('$nama', '$hobi', '$catatan')";

        if ($konek->query($sql) === TRUE) {
            echo json_encode('Data berhasil disimpan');
        } else {
            echo json_encode('data tidak tersimpan');
        }
    } else {
        echo json_encode('data tidak lengkap');
    }

?>