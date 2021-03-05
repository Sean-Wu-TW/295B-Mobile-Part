import React from 'react';
import { View, TextInput, Text } from 'react-native';

const UselessTextInput = (props) => {
  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable
      maxLength={40}
    />
  );
}

const UselessTextInputMultiline = () => {
  const [value, onChangeText] = React.useState('Useless Multiline Placeholder');
  const handleChange = (text) => {
    if (text) {
      onChangeText(text.toLowerCase());
    } else {
      onChangeText(null);
    }
  }

  // If you type something in the text box that is a color, the background will change to that
  // color.
  return (
    <>
      <View
        style={{
          backgroundColor: value,
          borderBottomColor: '#000000',
          borderBottomWidth: 1,
        }}>
        <UselessTextInput
          multiline
          numberOfLines={4}
          onChangeText={handleChange}
          value={value}
        />
      </View>
      <Text>
        {value}
      </Text>
    </>
  );
}

export default UselessTextInputMultiline;