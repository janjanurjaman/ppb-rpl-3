<?php
    include 'database.php';

    $data = json_decode(file_get_contents('php://input'));

    $sql = "SELECT * FROM catatan";
    $hasil = $konek->query($sql);

    $data = [];

    if ($hasil -> num_rows > 0) {
        while ($row = $hasil->fetch_assoc()) {
            $data[] = $row;
        }
    }

    echo json_encode($data);

    $konek->close();

?>