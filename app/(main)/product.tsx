// ProductsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE = 'http://10.51.13.153:3000';

// ---- Types ----
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editVisible, setEditVisible] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editStock, setEditStock] = useState("");

  function openEditModal(item: Product) {
  setEditItem(item);
  setEditName(item.name);
  setEditPrice(String(item.price));
  setEditCategory(item.category);
  setEditStock(String(item.stock));
  setEditVisible(true);
}



  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE}/api/products`);
      if (!resp.ok) throw new Error('Failed to fetch');

      const data: Product[] = await resp.json();
      setProducts(data);
    } catch (err: unknown) {
      const e = err instanceof Error ? err.message : 'Error';
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text>Error: {error}</Text>
      </View>
    );

    async function handleSaveEdit() {
    if (!editItem) return;

    try {
        const body = {
        name: editName,
        price: Number(editPrice),
        category: editCategory,
        stock: Number(editStock),
        imageUrl: editItem.imageUrl,
        };

        const resp = await fetch(`${API_BASE}/api/products/${editItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        });

        if (!resp.ok) throw new Error("Failed to update product");

        const updated = await resp.json();

        // update list
        setProducts(prev =>
        prev.map(p => (p._id === updated._id ? updated : p))
        );

        setEditVisible(false);

    } catch (err) {
        console.log(err);
        alert("Error updating product");
    }
}


async function handleDelete(id: string) {
  try {
    const resp = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
    });

    if (!resp.ok) throw new Error("Failed to delete");

    // Remove product locally
    setProducts(prev => prev.filter(p => p._id !== id));

  } catch (err) {
    console.log(err);
    alert("Error deleting product");
  }
}



  return (
    <>
    <Modal visible={editVisible} animationType="slide" transparent>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Edit Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={editName}
        onChangeText={setEditName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={editPrice}
        onChangeText={setEditPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={editCategory}
        onChangeText={setEditCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock"
        keyboardType="numeric"
        value={editStock}
        onChangeText={setEditStock}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.cancelBtn} onPress={() => setEditVisible(false)}>Cancel</Text>
        <Text style={styles.saveBtn} onPress={handleSaveEdit}>Save</Text>
      </View>
    </View>
  </View>
</Modal>

    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: item.imageUrl || 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=' }}
      style={styles.img}
    />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.cat}>{item.category} • ₹{item.price}</Text>
      <Text style={styles.stock}>Stock: {item.stock}</Text>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <Text style={{ color: "blue", marginRight: 20 }} onPress={() => openEditModal(item)}>
            Edit
        </Text>


        <Text
          style={{ color: "red" }}
          onPress={() => handleDelete(item._id)}
        >
          Delete
        </Text>
      </View>
    </View>
  </View>
)}



      />
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  img: { width: 72, height: 72, borderRadius: 6 },
  name: { fontSize: 16, fontWeight: '600' },
  cat: { color: '#666', marginTop: 4 },
  stock: { marginTop: 6, color: '#333' },
  modalBackdrop: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

modalBox: {
  width: "85%",
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 20,
  elevation: 5,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 12,
},

input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 10,
  marginBottom: 10,
},

cancelBtn: {
  fontSize: 16,
  color: "red",
},

saveBtn: {
  fontSize: 16,
  color: "green",
  fontWeight: "700",
},

});
