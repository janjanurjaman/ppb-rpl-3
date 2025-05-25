<?php
    include 'database.php';

    //mengubah string json ke object php
    $data = json_decode(file_get_contents('php://input'));

    if (isset($data->id) && isset($data->nama) && isset($data->hobi) && isset($data->catatan)) {
        $id = $data->id;
        $nama = $data->nama;
        $hobi = $data->hobi;
        $catatan = $data->catatan;

        $sql = "UPDATE catatan SET nama = '$nama', hobi_ku = '$hobi', catatanku = '$catatan' WHERE id = $id";

        if ($konek->query($sql) === TRUE) {
            echo json_encode('Catatan berhasil diedit');
        } else {
            echo json_encode('catatan gagal diedit');
        }
    } else {
        echo json_encode('ID tidak ditemukan');
    }

?>