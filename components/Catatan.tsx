import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

const FormCatatan = () => {
  type Catatan = {
    id: number;
    nama: string;
    hobi_ku: string;
    catatanku: string;
    tanggal: string;
  };

  const [nama, setNama] = useState("");
  const [hobi, setHobi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [data, setData] = useState<Catatan[]>([]);
  const [selectedItem, setSelectedItem] = useState<Catatan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (item: Catatan): void => {
    setSelectedItem({ ...item }); // Clone item supaya bisa diubah tanpa langsung memengaruhi list
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const handleButton = () => {
    if (nama === "" && hobi === "" && catatan === "") {
      Alert.alert("Error", "Form nama harus diisi!");
      return;
    }

    axios
      .post("http://192.168.110.4/ppb-rpl3/add.php", {
        nama,
        hobi,
        catatan,
      })
      .then((response) => {
        Alert.alert("BERHASIL DISIMPAN KE DB", response.data.message);
        setNama("");
        setHobi("");
        setCatatan("");
        fetchData();
      })
      .catch((error) => {
        Alert.alert("Error", "Data tidak terkirim ke db");
      });
  };

  const fetchData = () => {
    axios
      .get("http://192.168.110.4/ppb-rpl3/get.php")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setData([]);
        }
      })
      .catch(() => {
        Alert.alert("Error", "Gagal mengambil data dari database!");
      });
  };

  const handleUpdate = () => {
    if (selectedItem) {
      axios
      .post('http://192.168.110.4/ppb-rpl3/update.php', {
        id: selectedItem.id,
        nama: selectedItem.nama,
        hobi: selectedItem.hobi_ku,
        catatan: selectedItem.catatanku
      })
      .then(() => {
        Alert.alert('SUKSES', 'Catatan berhasil diperbaharui!')
        closeModal()
        fetchData()
      })
      .catch(() => {
        Alert.alert('ERROR', 'Catatan gagal diperbaharui!')
      })
    }
  }

  const handleDelete = (id: number) => {
    Alert.alert('KONFIRMASI', 'Apakah anda yakin akan menghapus catatan ini?', [
      {
        text: 'Batal',
        style: 'cancel'
      },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          axios
          .post('http://192.168.110.4/ppb-rpl3/delete.php', {id})
          .then(() => {
            Alert.alert('Catatan berhasil dihapus!')
            fetchData()
          })
          .catch(() => {
            Alert.alert('ERROR', 'Catatan gagal dihapus!')
          })
        }
      }
    ])
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <View>
        <TextInput
          style={styles.inputNama}
          value={nama}
          onChangeText={setNama}
          placeholder="masukan nama"
        />
        <TextInput
          style={styles.inputNama}
          value={hobi}
          onChangeText={setHobi}
          placeholder="masukan hobi"
        />
        <TextInput
          style={styles.inputCatatan}
          value={catatan}
          onChangeText={setCatatan}
          placeholder="masukan catatan"
          multiline={true}
        />
      </View>
      <Button title="SIMPAN" onPress={handleButton} />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => openModal(item)}>
              <Text>{item.nama}</Text>
              <Text>{item.hobi_ku}</Text>
              <Text>{item.catatanku}</Text>
              <Text>{item.tanggal}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <TextInput 
                style={styles.inputNama}
                value={selectedItem.nama}
                onChangeText={(text) => 
                  setSelectedItem({...selectedItem, nama: text})
                }/>
                <TextInput 
                style={styles.inputNama}
                value={selectedItem.hobi_ku}
                onChangeText={(text) => 
                  setSelectedItem({...selectedItem, hobi_ku: text})
                }/>
                <TextInput 
                style={styles.inputCatatan}
                value={selectedItem.catatanku}
                onChangeText={(text) => 
                  setSelectedItem({...selectedItem, catatanku: text})
                }/>

                <Button title='UPDATE' onPress={handleUpdate}/>
              </>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.iconClose}>
              <Text style={{ fontSize: 19 }}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FormCatatan;

const styles = StyleSheet.create({
  inputNama: {
    width: 200,
    height: 50,
    borderWidth: 1,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  inputCatatan: {
    height: 150,
    borderWidth: 1,
    marginHorizontal: 15,
    marginBottom: 10,
    textAlignVertical: "top",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#f5f5f5",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    position: "relative",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 5,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(192, 192, 192, 0.73)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    padding: 15,
  },
  iconClose: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
