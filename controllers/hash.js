import bcrypt from 'bcryptjs';

const run = async () => {
  const hashed = await bcrypt.hash('admin123', 12);
  console.log(hashed);
};

run();
