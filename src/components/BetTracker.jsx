import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const BetTracker = () => {
  const [bets, setBets] = useState(() => {
    const savedBets = localStorage.getItem('bets');
    return savedBets ? JSON.parse(savedBets) : [];
  });

  const [newBet, setNewBet] = useState({
    title: '',
    name: '',
    amount: '',
    multiplier: ''
  });

  const [editingBet, setEditingBet] = useState(null);
  const [suggestions, setSuggestions] = useState({
    titles: [],
    names: []
  });

  useEffect(() => {
    localStorage.setItem('bets', JSON.stringify(bets));
    const uniqueTitles = [...new Set(bets.map(bet => bet.title))];
    const uniqueNames = [...new Set(bets.map(bet => bet.name))];
    setSuggestions({
      titles: uniqueTitles,
      names: uniqueNames
    });
  }, [bets]);

  const handleAddBet = (e) => {
    e.preventDefault();
    if (!newBet.title || !newBet.name || !newBet.amount || !newBet.multiplier) return;

    const amount = parseFloat(newBet.amount);
    const multiplier = parseFloat(newBet.multiplier);
    const returnAmount = (amount * multiplier).toFixed(2);

    setBets([...bets, { ...newBet, amount, multiplier, returnAmount }]);
    setNewBet({ title: '', name: '', amount: '', multiplier: '' });
  };

  const handleDeleteBet = (index) => {
    const updatedBets = bets.filter((_, i) => i !== index);
    setBets(updatedBets);
  };

  const handleClearAll = () => {
    setBets([]);
  };

  const handleEditBet = (index) => {
    setEditingBet(index);
  };

  const handleUpdateBet = (index, field, value) => {
    const updatedBets = [...bets];
    updatedBets[index] = { ...updatedBets[index], [field]: value };
    
    if (field === 'amount' || field === 'multiplier') {
      const amount = parseFloat(field === 'amount' ? value : updatedBets[index].amount);
      const multiplier = parseFloat(field === 'multiplier' ? value : updatedBets[index].multiplier);
      if (!isNaN(amount) && !isNaN(multiplier)) {
        updatedBets[index].returnAmount = (amount * multiplier).toFixed(2);
      }
    }
    
    setBets(updatedBets);
  };

  const handleSaveEdit = () => {
    setEditingBet(null);
  };

  const filterSuggestions = (value, type) => {
    if (!value) return [];
    const sourceList = type === 'title' ? suggestions.titles : suggestions.names;
    return sourceList.filter(item => 
      item.toLowerCase().includes(value.toLowerCase()) && item !== value
    );
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            SIMPLE BET TRACKER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddBet} className="grid grid-cols-5 gap-2 mb-4">
            <div className="relative">
              <Input
                placeholder="Nombre de apuesta"
                value={newBet.title}
                onChange={(e) => setNewBet({ ...newBet, title: e.target.value })}
                list="titleSuggestions"
              />
              <datalist id="titleSuggestions">
                {filterSuggestions(newBet.title, 'title').map((title, i) => (
                  <option key={i} value={title} />
                ))}
              </datalist>
            </div>
            <div className="relative">
              <Input
                placeholder="Nombre"
                value={newBet.name}
                onChange={(e) => setNewBet({ ...newBet, name: e.target.value })}
                list="nameSuggestions"
              />
              <datalist id="nameSuggestions">
                {filterSuggestions(newBet.name, 'name').map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="Monto"
              value={newBet.amount}
              onChange={(e) => setNewBet({ ...newBet, amount: e.target.value })}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Cuota"
              value={newBet.multiplier}
              onChange={(e) => setNewBet({ ...newBet, multiplier: e.target.value })}
            />
            <Button 
              type="submit" 
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              <PlusCircle className="w-4 h-4" /> Añadir
            </Button>
          </form>

          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleClearAll}
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              <Trash2 className="w-4 h-4" /> Borrar todo
            </Button>
          </div>

          <div className="space-y-2">
            {bets.map((bet, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-7 gap-4 items-center">
                  {editingBet === index ? (
                    <>
                      <Input
                        value={bet.title}
                        onChange={(e) => handleUpdateBet(index, 'title', e.target.value)}
                        list="editTitleSuggestions"
                      />
                      <Input
                        value={bet.name}
                        onChange={(e) => handleUpdateBet(index, 'name', e.target.value)}
                        list="editNameSuggestions"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={bet.amount}
                        onChange={(e) => handleUpdateBet(index, 'amount', e.target.value)}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        value={bet.multiplier}
                        onChange={(e) => handleUpdateBet(index, 'multiplier', e.target.value)}
                      />
                      <div className="font-bold">S/ {bet.returnAmount}</div>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit()}
                        className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                      >
                        <Check className="w-4 h-4" /> Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="font-medium">{bet.title}</div>
                      <div>{bet.name}</div>
                      <div>S/ {parseFloat(bet.amount).toFixed(2)}</div>
                      <div>x{parseFloat(bet.multiplier).toFixed(2)}</div>
                      <div className="font-bold">S/ {bet.returnAmount}</div>
                      <Button
                        size="sm"
                        onClick={() => handleEditBet(index)}
                        className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                      >
                        Editar
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleDeleteBet(index)}
                    className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                  >
                    <Trash2 className="w-4 h-4" /> Borrar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetTracker;