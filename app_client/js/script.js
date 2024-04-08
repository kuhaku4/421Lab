const board = Chessboard('board', {
    position: 'start',
    sparePieces: true,
    moveSpeed: 'slow',
    pieceTheme: 'https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/images/chesspieces/wikipedia/{piece}.png'
  });
  
  const chess = new Chess();
  
  document.getElementById('start').addEventListener('click', () => {
    board.start();
    const game = new Chess();
    const onMove = (source, target) => {
      const move = game.move({ from: source, to: target });
      if (move === null) return 'snapback';
      board.position(game.fen());
    };
    board.on('move', onMove);
  });