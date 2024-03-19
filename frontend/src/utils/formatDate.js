const formatDateString = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (date.toDateString() === now.toDateString()) {
    return 'Сегодня, ' + date.toLocaleTimeString('ru-RU', options);
  } else if (diffInDays === 1) {
    return 'Вчера, ' + date.toLocaleTimeString('ru-RU', options);
  } else if (diffInDays < 7) {
    const weekdays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    return 'В ' + weekdays[date.getDay()] + ', ' + date.toLocaleTimeString('ru-RU', options);
  } else if (date.getFullYear() === now.getFullYear()) {
    return 'В ' + date.toLocaleString('ru-RU', { month: 'long' }) + ' ' + date.getDate() + ', ' + date.toLocaleTimeString('ru-RU', options);
  } else {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatter.format(date);
  }
};

export default formatDateString;